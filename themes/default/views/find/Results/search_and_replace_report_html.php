<?php
/* ----------------------------------------------------------------------
 * themes/default/views/find/Results/search_and_replace_report_html.php
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

$va_report = $this->getVar('snr_report');

?>

<div id='searchAndReplaceReport' class='rounded'>
	<?php
	print "<div>"._t("Searched %1 records and %2 bundles for <em>'%3'</em> and replaced %4 instances with <em>'%5'</em>.",
		$va_report['records_queried'],$va_report['bundles_queried'],$va_report['search'],$va_report['replacements'],$va_report['replace'])."</div>";
	?>
</div>
