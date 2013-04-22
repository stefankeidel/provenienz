<?php
/* ----------------------------------------------------------------------
 * themes/default/views/find/Results/search_and_replace_preview_info_html.php :
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

	$vs_search = $this->getVar('snr_search');
	$vs_replace = $this->getVar('snr_replace');
?>

<div id='searchAndReplacePreviewInfo' class='rounded'>
<?php 
	print caNavIcon($this->request,__CA_NAV_BUTTON_ALERT__)."\n"; 
	print _t("You're about to replace all instances of &quot;%1&quot; with &quot;%2&quot;. Below is a preview.",$vs_search,$vs_replace);
?>

</div>