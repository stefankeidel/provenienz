<?php
/* ----------------------------------------------------------------------
 * themes/default/views/find/Results/search_and_replace_form_html.php
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
 * ----------------------------------------------------------------------
 */

// old form values

$vs_search = $this->getVar('snr_search');
$vs_replace = $this->getVar('snr_replace');

if(!($vs_case_sensitive = $this->getVar('not_case_sensitive'))){
	$vs_case_sensitive = "cs";
}

?>
		<!-- search and replace -->
		<div id="searchAndReplaceBox">
			<?php print caFormTag($this->request, 'SearchAndReplacePreview', 'caSearchAndReplaceForm', $this->request->getModulePath().'/'.$this->request->getController(), 'post', 'multipart/form-data', '_top', array('disableUnsavedChangesWarning' => true)); ?>
				<div class="col">
					<?php print _t("Replace"); ?>
					<?php print caHTMLTextInput('caReplaceSearch',array('width' => '25', 'value' => $vs_search)); ?>
				</div>
				<div class="col">
					<?php print _t("With"); ?>
					<?php print caHTMLTextInput('caReplaceWith',array('width' => '25', 'value' => $vs_replace)); ?>
				</div>
				<div class="col">
					<?php print caFormSubmitButton($this->request, __CA_NAV_BUTTON_GO__, '', 'caSearchAndReplaceForm'); ?>
				</div>
				<div style='clear:both;height:1px;'>&nbsp;</div>
				<div id="caAdvancedSearchAndReplaceOptions">
					<div style='clear:both;height:1px;'>&nbsp;</div>
					<div class="col">
						<?php print caHTMLRadioButtonsInput('caReplacementCaseSensitive',array(
							_t('case sensitive') => 'cs',
							_t('case insensitive') => 'ci',
						),null,array('value' => $vs_case_sensitive)); ?>
					</div>
					<div style='clear:both;height:1px;'>&nbsp;</div>
				</div>
				<div style='clear:both;height:1px;'>&nbsp;</div>
			</form>
		</div><!-- end search and replace -->
