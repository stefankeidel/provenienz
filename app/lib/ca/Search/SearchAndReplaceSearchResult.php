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
	# ------------------------------------------------------------------
	/**
	 * SearchAndReplaceSearchResult objects are always constructed from
	 * existing search results, like ObjectBrowseResult
	 * 
	 * @param BaseSearchResult $po_result existing search result
	 */
	public function __construct($po_result) {
		$this->opo_original_result = $po_result;
	}
	# ------------------------------------------------------------------
	/**
	 * Reroute calls for unimplemented functions as-is to original search result
	 */
	public function __call($ps_name,$pa_args){
		return call_user_func_array(array($this->opo_original_result, $ps_name), $pa_args);
	}
	# ------------------------------------------------------------------
}
