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
	}
	# ------------------------------------------------------------------
	public function getSearchAndReplacePreview($pa_display_item) {
		if(!$pa_display_item['allowInlineEditing']){
			return "";
		}

		$vs_original_val = $this->opo_original_result->get($pa_display_item['bundle_name']);

		if($this->opb_not_case_sensitive){
			$vs_replace_val = preg_replace("!".$this->ops_search."!i", $this->ops_replace, $vs_original_val);
		} else {
			$vs_replace_val = preg_replace("!".$this->ops_search."!", $this->ops_replace, $vs_original_val);	
		}

		return array(
			'original' => $vs_original_val,
			'new' => $vs_replace_val,
			'search' => $this->ops_search,
			'replace' => $this->ops_replace,
			'replaced' => ($vs_original_val != $vs_replace_val),
		);
	}
	# ------------------------------------------------------------------
	public function doSearchAndReplace(){
		caDebug($this->ops_search);
		caDebug($this->ops_replace);
	}
	# ------------------------------------------------------------------
	/**
	 * Reroute calls for unimplemented functions to original search result
	 */
	public function __call($ps_name,$pa_args){
		return call_user_func_array(array($this->opo_original_result, $ps_name), $pa_args);
	}
	# ------------------------------------------------------------------
}
