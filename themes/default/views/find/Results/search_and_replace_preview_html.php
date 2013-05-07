<?php
/* ----------------------------------------------------------------------
 * themes/default/views/find/Results/search_and_replace_preview_html.php
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

$vb_is_snr_preview		= (bool) $this->getVar('is_snr_preview');

if($vb_is_snr_preview) {
	$vs_search = $this->getVar('snr_search');
	$vs_replace = $this->getVar('snr_replace');
	?>

	<div id='searchAndReplacePreviewInfo' class='rounded'>
	<?php 

		print "<div>"._t("This is only a preview.")."</div>";
		print "<div>";
		print caNavButton($this->request,__CA_NAV_BUTTON_CANCEL__,_t("Cancel"),$this->request->getModulePath(), $this->request->getController(), "Index");
		print caNavButton($this->request,__CA_NAV_BUTTON_GO__,_t("Save changes"),$this->request->getModulePath(), $this->request->getController(), "SearchAndReplace");
		print "</div>";
	?>
	</div>

	<?php
}

