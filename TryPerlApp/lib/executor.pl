#!/usr/bin/perl

# executor.pl
#
# Created by Gideon Dsouza on 2013-01-06

use strict;
use warnings;

use Safe;

if($ARGV[0]) {
	my $code = $ARGV[0];
	my $compartment = new Safe;
	$compartment->deny(qw(:base_io :ownprocess :subprocess :filesys_read :sys_db :filesys_open :filesys_write :dangerous));
	$compartment->permit(qw(print say pack unpack require caller));
	my $result = $compartment->reval($code);
	if ($@) {
		print "Unsafe code detected: $@";
	}
}
