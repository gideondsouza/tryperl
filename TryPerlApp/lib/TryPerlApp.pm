package TryPerlApp;
use Dancer ':syntax';
use Dancer::Plugin::Auth::Github;
use Net::GitHub::V3;
use Data::Dumper;
use LWP::Simple();

use HTTP::Request::Common qw(POST);
use LWP::UserAgent;

use File::Temp;
use Image::DominantColors;

our $VERSION = '0.1';

#set 'session'      => 'Simple';
set 'template'     => 'template_toolkit';

auth_github_init();

hook before => sub {
		#     return if request->path =~ m{/auth/github/callback} or request->path =~ m{/login};
		#     if (not session('github_user')) {
		# 		redirect '/login';
		#     }
};

get '/' => sub {
	if(not session('github_user')) {
		return template 'index.tt', {
			gravatarId => 'xxx',
			username => 'xxx',
			login_url => auth_github_authenticate_url
		};
	}
	return template 'index.tt', {
		gravatarId => session('github_user')->{'gravatar_id'},
		username => session('github_user')->{'login'}
	};
};
# get '/login' => sub {
# 	return template 'login.tt',{
# 		login_url => auth_github_authenticate_url
# 	};
# };
get '/about' => sub {
	return template 'about.tt';
};
get '/logout' => sub {
	session->destroy;
	redirect '/';
};
# get '/avatar.png'=> {
# # http://www.gravatar.com/avatar/5aefd3e85213e1c22ee31e4ce6123d40?size=16
# 
# };
post '/compile' => sub{
	my $result	= compile(params->{content});
	my $stat = false;
	if($result =~ m/syntax ok/i)
	{
		$stat = true;
	}
	content_type 'application/json';
	return to_json({success=>$stat,output=>$result});
};
post '/run' => sub {
	debug '====> Entering RUN\n';
	my $result	= run_safe(params->{content},params->{arg});
	my $stat = false;
	debug "====> $result";
	if($result =~ m/syntax ok/i)
	{
		$stat = true;
	}
	content_type 'application/json';
	return to_json({success=>$stat,output=>$result});	
};
get '/getgists' => sub {
	my $ret = [];
	my $gh = getGitHubObj();
	my @gists = $gh->gist->gists;
	
	foreach my $g (@gists) {
		my @files = keys(%{$g->{files}});	
		my $file = $files[0];
		if ($file =~ m{.pl})
		{
			my %codefile = ();
			$codefile{filename} = $file;
			$codefile{file_id} = $g->{id};
			$codefile{description} = $g->{description};
			$codefile{comment_count} = $g->{comments};
			push @$ret, \%codefile;
		}
	}
	debug "===> Dumping gist fetched\n";
	debug Dumper($ret);	
	content_type 'application/json';
	return to_json($ret);
};
get '/getgistcontent/:id' => sub {
	my $id = params->{id};
	my $gh = getGitHubObj();
	my $the_gist = undef;
	eval {
		$the_gist = $gh->gist->gist($id);
	};
	if($@) {
		return "Invalid file or something else went wrong :(";
	}
	my @files = keys(%{$the_gist->{files}});	
	my $file = $files[0];
	if ($file =~ m{.pl})
	{
		my $filecont = getcontent($the_gist->{files}->{$file}->{raw_url});
		#this is a little dirty because decoding html entities on the client is a little pain. :'(
		return $filecont."\n#F:$file";
	} 
	return "Invalid Id";
};
post '/newgist' => sub {
	my ($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = localtime(time);
	my $filename = params->{filename}; 
	# access_token => session('github_access_token')
	my $gh = getGitHubObj();
	my $gist = $gh->gist->create( {
      "description" => "Created by www.tryperl.com",
      "public" => 'true',
      "files"  =>  {
        "$filename" => {
            "content" => q(#Created by tryperl.com
use strict;
use warnings;

print "Go Ahead and edit me!";
print "Once you are done editing, click SAVE to save changes :D";
# print <>; #you can use the STDIN to put data into your program 
)
        }
      }
    });	
	debug "===> Dumping gist returned\n";
	debug Dumper($gist->{id});
    return $gist->{id};
};
post '/savegist' => sub {
	my ($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = localtime(time);
	my $id = params->{id}; 
	my $filename = params->{filename}; 
	my $content = params->{content}; 
	my $gh = getGitHubObj();
	my $gist = $gh->gist->update($id,{
      "description" => "Created by www.tryperl.com.",
      "public" => 'true',
      "files"  =>  {
        "$filename" => {
            "content" => $content
        }
      }
    });	
    return "Updated file."
};
###################################################################################################
#This is some extra pizaz
get '/dominantcolors' => sub {
	return template 'dominantcolors.tt';
};
post '/getcolors' => sub {
	my $the_url =  params->{url}; 
	debug "The url is $the_url";
	my $hd = getFileSize($the_url);
	if($hd) {
		if($hd->content_length < 768000) {
			my $data = LWP::Simple::get($the_url);
			my $fh = File::Temp->new();
			my $filename = $fh->filename;
			binmode ($fh);
			print $fh $data;
			
			my $dmt = Image::DominantColors->new({file => $filename});
			my $r = $dmt->getDominantColors();
			
			close ($fh);
			return to_json($r);
		}
		return to_json({error => 'File is too large. Only upto 750KB allowed'});
	}
	if($@) {
			return to_json({error => 'Oops. Something went wrong. Double check your url'});
	}
	return to_json({error => 'Request was bad, either your url is bad or your are not loading an image.'});
};

###################################################################################################
#Helper methods 
#Yes I could put them in a seperate file/package but I like to keep it simple :)
sub getGitHubObj {
	my $gh;
	if(not session('github_user')) {
		$gh = Net::GitHub::V3->new({ login => 'tryperl', pass => 'Judges678*_t'});
	} else {
		$gh = Net::GitHub::V3->new(access_token => session('github_access_token'));
	}
	return $gh;
}

sub compile {
	my $code = shift;
	open(FILE,"perl -ce '$code' 2>&1 |") || die "Problem Compiling=> $!";
	my @output=<FILE>;
	my $resp = join('',@output);
	close(FILE);
	return $resp; 
}
sub getcontent {
	my $url = shift;
	my $content = LWP::Simple::get($url) or die "Couldn't get content";
	return $content;
}
sub run_safe {
	my $code = shift;
	my $arg = shift;
	#online this has to be ../lib/executor.pl locally this has to be the FULL path? :(
	#full path => /Users/gideon/Documents/Coding/TryPerlMain/TryPerlApp/lib/	
	# open(FILE,"perl ../lib/executor.pl '$code' 2>&1 |") || die "Problem Compiling=> $!";
	# 	my @output=<FILE>;
	# 	my $resp = join('',@output);
	# 	close(FILE);	
	# 	return $resp;
	eval {
		my $ua = LWP::UserAgent->new();  
		my $req = POST 'http://ExecLoadBalancer-1521599104.us-east-1.elb.amazonaws.com:8001/exec', [ 
	 	code=> $code,
	 	arg=> $arg,
		]; 
		my $content = $ua->request($req)->content;
		return $content;
	};
	if($@) {
	 	return "Something went wrong with the request. Please report if this persists";
	}
}
sub getFileSize{
    my $url=shift;
    my $ua = new LWP::UserAgent;
    $ua->agent("Mozilla/5.0");
    my $req = new HTTP::Request 'HEAD' => $url;
    $req->header('Accept' => 'text/html');
    my $res = $ua->request($req);
    if ($res->is_success) {
             my $headers = $res->headers;
             return $headers;
    }
	return 0;
}


true;
