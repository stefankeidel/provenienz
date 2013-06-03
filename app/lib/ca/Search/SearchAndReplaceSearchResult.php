<?php
/** ---------------------------------------------------------------------
 * app/lib/core/Search/SearchAndReplaceSearchResult.php :
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2013 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * @package CollectiveAccess
 * @subpackage Search
 * @license http://www.gnu.org/copyleft/gpl.html GNU Public License version 3
 *
 * ----------------------------------------------------------------------
 */
 
 /**
  *
  */

class SearchAndReplaceSearchResult {
	# ------------------------------------------------------------------
	/**
	 * The original search result
	 */
	protected $opo_original_result;

	/**
	 * Options
	 */
	protected $ops_search;
	protected $ops_replace;
	protected $opb_not_case_sensitive;

	/**
	 * State
	 */
	protected $opb_did_replace;
	protected $opn_records_queried;
	protected $opn_bundles_queried;
	protected $opn_replacements;

	# ------------------------------------------------------------------
	/**
	 * SearchAndReplaceSearchResult objects are always constructed from
	 * existing search results, like ObjectBrowseResult
	 * 
	 * @param BaseSearchResult $po_result existing search result
	 */
	public function __construct($po_result,$ps_search,$ps_replace,$pa_options) {
		$this->opo_original_result = $po_result;
		$this->ops_search = $ps_search;
		$this->ops_replace = $ps_replace;
		$this->opb_not_case_sensitive = (isset($pa_options['not_case_sensitive']) ? (bool)$pa_options['not_case_sensitive'] : false );

		// initial state
		$this->opb_did_replace = false;
		$this->opn_records_queried = 0;
		$this->opn_bundles_queried = 0;
		$this->opn_replacements = 0;
	}
	# ------------------------------------------------------------------
	/**
	 * Get search and replace preview for single display item
	 * @param array $pa_display_item array representation of display item
	 * @return array array containing the original value, the new value, the search expression,
	 *   the replace expression and a flag that indicates whether something has been replaced
	 */
	public function getSearchAndReplacePreviewForItem($pa_display_item) {
		if(!$pa_display_item['allowSearchAndReplace']){
			return "";
		}

		$vs_original_val = $this->opo_original_result->get($pa_display_item['bundle_name']);
		$vn_replacements = 0;
		$vs_replace_val = $this->doReplace($vs_original_val,$vn_replacements);

		return array(
			'original' => $vs_original_val,
			'new' => $vs_replace_val,
			'search' => $this->ops_search,
			'replace' => $this->ops_replace,
			'replaced' => ($vs_original_val != $vs_replace_val),
		);
	}
	# ------------------------------------------------------------------
	/**
	 * Execute search and replace on the whole search result for given display item list
	 */
	public function saveSearchAndReplace($pa_display_list,$po_request){
		global $g_ui_locale_id;

		// store old pointer
		$vn_old_index = $this->opo_original_result->currentIndex();
		$this->opo_original_result->seek(0);

		$vs_table = $this->opo_original_result->getResultTableName();
		$o_dm = Datamodel::load();
		$t_instance = $o_dm->getInstanceByTableName($vs_table, true);

		while($this->opo_original_result->nextHit()){
			if($t_instance->load($this->opo_original_result->get($t_instance->primaryKey()))) {
				$t_instance->setMode(ACCESS_WRITE);
				$this->opn_records_queried++;

				foreach($pa_display_list as $vs_placement => $va_display_item){
					// not all display items support replacements. skip those that don't
					if(!$va_display_item['allowSearchAndReplace']){ continue; }
					if (!$t_instance->isSaveable($po_request)){ continue; }

					$va_tmp = explode(".",$va_display_item['bundle_name']);
					switch(sizeof($va_tmp)){
						case 1:
							$vs_bundle = $va_tmp[0];
							break;
						case 2:
						default:
							$vs_bundle = $va_tmp[1];
							break;
					}

					if($po_request->user->getBundleAccessLevel($vs_table, $vs_bundle) != __CA_BUNDLE_ACCESS_EDIT__) { continue; }

					$this->opn_bundles_queried++;

					$vs_pattern = "|".$this->ops_search.($this->opb_not_case_sensitive ? "|i" : "|");

					//
					// LABELS
					// 
					if($vs_bundle == "preferred_labels"){
						$vn_label_id = $t_instance->getPreferredLabelID($g_ui_locale_id);
						
						$vs_original_val = $t_instance->get($va_display_item['bundle_name']);
						
						$vn_replacements = 0;
						$vs_new_val = $this->doReplace($vs_original_val,$vn_replacements);
						$this->opn_replacements += $vn_replacements;

						if($vn_replacements>0){
							$va_label_values = array();
							$va_label_values[$t_instance->getLabelDisplayField()] = $vs_new_val;

							// if label used in display is in different locale than UI, we have to find it to make sure we
							// actually replace what we've shown in preview (which comes straight out of get())
							if(!$vn_label_id){
								$va_labels = $t_instance->getPreferredLabels();

								$va_user_labels = caExtractValuesByUserLocale($va_labels);

								foreach($va_user_labels as $va_label_list) {
									foreach($va_label_list as $va_label) {
										$vn_label_id = $va_label['label_id'];
									}
								}
							}

							if($vn_label_id){
								$t_instance->editLabel($vn_label_id, $va_label_values, $g_ui_locale_id, null, true);
							}
						}
					//
					// INTRINSICS
					// 
					} elseif($t_instance->hasField($vs_bundle)) {
						$vs_original_val = $t_instance->get($vs_bundle);
						
						$vn_replacements = 0;
						$vs_new_val = $this->doReplace($vs_original_val,$vn_replacements);
						$this->opn_replacements += $vn_replacements;

						if($vn_replacements>0){
							$t_instance->set($vs_bundle,$vs_new_val);
							$t_instance->update();
						}
					//
					// ATTRIBUTES
					// 
					} elseif($t_instance->hasElement($vs_bundle)) {
						$t_instance->clearErrors();
						$vn_datatype = ca_metadata_elements::getElementDatatype($vs_bundle);
						if(in_array($vn_datatype,array(1,2,5,6,8,9,10,11,12))) {
							$vs_original_val = $t_instance->get($va_display_item['bundle_name']);
							
							$vn_replacements = 0;
							$vs_new_val = $this->doReplace($vs_original_val,$vn_replacements);

							if($vn_replacements>0){
								$t_instance->replaceAttribute(array(
									'locale_id' => $g_ui_locale_id,
									$vs_bundle => $vs_new_val
								), $vs_bundle);
								$t_instance->update();

								// only count successful replacements
								if($t_instance->numErrors() == 0){
									$this->opn_replacements += $vn_replacements;
								}
							}
						}
					}
				}	
			}
		}

		// restore old pointer
		$this->opo_original_result->seek($vn_old_index);

		$this->opb_did_replace = true;
	}
	# ------------------------------------------------------------------
	public function didSearchAndReplace(){
		return $this->opb_did_replace;
	}
	# ------------------------------------------------------------------
	public function getSearchAndReplaceReport(){
		return array(
			'did_replace' => $this->opb_did_replace,
			'records_queried' => $this->opn_records_queried,
			'bundles_queried' => $this->opn_bundles_queried,
			'replacements' => $this->opn_replacements,
			'search' => $this->ops_search,
			'replace' => $this->ops_replace,
		);
	}
	# ------------------------------------------------------------------
	/**
	 * Reroute calls for unimplemented functions to original search result
	 */
	public function __call($ps_name,$pa_args){
		return call_user_func_array(array($this->opo_original_result, $ps_name), $pa_args);
	}
	# ------------------------------------------------------------------
	protected function doReplace($ps_val,&$pn_replacements){
		$pn_replacements = 0;

		if(strlen($ps_val)<1) return "";
		
		// exact search
		if(substr($this->ops_search, 0, 1) === '"' && substr($this->ops_search, -1, 1) === '"'){
			// strip quotes
			$vs_search = substr($this->ops_search, 1, strlen($this->ops_search)-2);

			// now do as-is replace
			if($this->opb_not_case_sensitive){
				return str_ireplace($vs_search, $this->ops_replace, $ps_val, $pn_replacements);
			} else {
				return str_replace($vs_search, $this->ops_replace, $ps_val, $pn_replacements);	
			}
		}

		// try passing through preg_replace as-is
		$vs_pattern = "|".$this->ops_search.($this->opb_not_case_sensitive ? "|i" : "|");
		if($vs_return = @preg_replace($vs_pattern, $this->ops_replace, $ps_val, -1, $pn_replacements)){
			return $vs_return;
		}

		// if that fails, do simplest form of str_replace
		if($this->opb_not_case_sensitive){
			return str_ireplace($this->ops_search, $this->ops_replace, $ps_val, $pn_replacements);
		} else {
			return str_replace($this->ops_search, $this->ops_replace, $ps_val, $pn_replacements);	
		}
	}
	# ------------------------------------------------------------------
}
