### 文件路径: `composer.json`

```json
{
    "name": "shebaoting/dependency-collector",
    "description": "Collects and displays information about Flarum extensions and their dependencies",
    "keywords": [
        "flarum"
    ],
    "type": "flarum-extension",
    "license": "MIT",
    "require": {
        "flarum/core": "^1.2.0"
    },
    "authors": [
        {
            "name": "Shebaoting",
            "email": "th9th@th9th.com",
            "role": "Developer"
        }
    ],
    "autoload": {
        "psr-4": {
            "Shebaoting\\DependencyCollector\\": "src/"
        }
    },
    "extra": {
        "flarum-extension": {
            "title": "Dependency Collector",
            "category": "",
            "icon": {
                "name": "",
                "color": "",
                "backgroundColor": ""
            }
        },
        "flarum-cli": {
            "modules": {
                "admin": true,
                "forum": true,
                "js": true,
                "jsCommon": true,
                "css": true,
                "locale": true,
                "gitConf": true,
                "githubActions": true,
                "prettier": true,
                "typescript": true,
                "bundlewatch": false,
                "backendTesting": true,
                "editorConfig": true,
                "styleci": true
            }
        }
    },
    "minimum-stability": "dev",
    "prefer-stable": true,
    "autoload-dev": {
        "psr-4": {
            "Shebaoting\\DependencyCollector\\Tests\\": "tests/"
        }
    },
    "scripts": {
        "test": [
            "@test:unit",
            "@test:integration"
        ],
        "test:unit": "phpunit -c tests/phpunit.unit.xml",
        "test:integration": "phpunit -c tests/phpunit.integration.xml",
        "test:setup": "@php tests/integration/setup.php"
    },
    "scripts-descriptions": {
        "test": "Runs all tests.",
        "test:unit": "Runs all unit tests.",
        "test:integration": "Runs all integration tests.",
        "test:setup": "Sets up a database for use with integration tests. Execute this only once."
    },
    "require-dev": {
        "flarum/testing": "^1.0.0"
    }
}
```

### 文件路径: `extend.php`

```php
<?php

/*
 * This file is part of shebaoting/dependency-collector.
 *
 * Copyright (c) 2025 Shebaoting.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Shebaoting\DependencyCollector;

use Flarum\Extend;
use Flarum\Api\Serializer\ForumSerializer; // 用于暴露权限给前端
use Flarum\Group\Group; // 用于设置默认权限
use Shebaoting\DependencyCollector\Api\Controller; // 你的 API 控制器命名空间
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Shebaoting\DependencyCollector\Access\DependencyItemPolicy; // 你的 Policy 类

return [
    // 论坛前端设置
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')    // 注册论坛 JavaScript 文件
        ->css(__DIR__ . '/less/forum.less')   // 注册论坛 LESS/CSS 文件
        ->route('/dependencies', 'dependency-collector.forum.index'), // 注册依赖项展示页面的前端路由

    // 管理后台前端设置
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')    // 注册管理后台 JavaScript 文件
        ->css(__DIR__ . '/less/admin.less'),  // 注册管理后台 LESS/CSS 文件

    // API 路由设置
    (new Extend\Routes('api'))
        // Dependency Items
        ->get('/dependency-items', 'dependency-collector.items.index', Controller\ListDependencyItemsController::class)
        ->post('/dependency-items', 'dependency-collector.items.create', Controller\CreateDependencyItemController::class)
        ->patch('/dependency-items/{id}', 'dependency-collector.items.update', Controller\UpdateDependencyItemController::class)
        ->delete('/dependency-items/{id}', 'dependency-collector.items.delete', Controller\DeleteDependencyItemController::class)

        // Dependency Tags
        ->get('/dependency-tags', 'dependency-collector.tags.index', Controller\ListDependencyTagsController::class)
        ->post('/dependency-tags', 'dependency-collector.tags.create', Controller\CreateDependencyTagController::class)
        ->patch('/dependency-tags/{id}', 'dependency-collector.tags.update', Controller\UpdateDependencyTagController::class)
        ->delete('/dependency-tags/{id}', 'dependency-collector.tags.delete', Controller\DeleteDependencyTagController::class),

    // 国际化语言文件设置
    (new Extend\Locales(__DIR__ . '/locale')),

    // 权限策略设置
    (new Extend\Policy())
        ->modelPolicy(DependencyItem::class, DependencyItemPolicy::class), // 为 DependencyItem 模型注册权限策略

    // 视图设置 (如果你的权限有自定义的描述文本，可能会用到)
    // (new Extend\View())
    //    ->namespace('dependency-collector.admin.permissions', __DIR__ . '/views/admin/permissions'),

    // 默认权限授予
    // (new Extend\Permissions())
    //     ->grant('dependency-collector.submit', Group::MEMBER_ID) // 默认允许“成员”用户组提交依赖项
    //     ->grant('dependency-collector.moderate', Group::MODERATOR_ID) // 默认允许“版主”审核
    //     ->grant('dependency-collector.moderate', Group::ADMINISTRATOR_ID) // 默认允许“管理员”审核
    //     ->grant('dependency-collector.manageTags', Group::ADMINISTRATOR_ID), // 默认只允许“管理员”管理插件标签

    // 将 canSubmitDependencyCollectorItem 权限暴露给论坛前端
    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attribute('canSubmitDependencyCollectorItem', function ($serializer, $model, $attributes) {
            return $serializer->getActor()->hasPermission('dependency-collector.submit');
        }),
];
```

### 文件路径: `.git\config`

```text
[core]
	repositoryformatversion = 0
	filemode = false
	bare = false
	logallrefupdates = true
	symlinks = false
	ignorecase = true
```

### 文件路径: `.git\description`

```text
Unnamed repository; edit this file 'description' to name the repository.
```

### 文件路径: `.git\FETCH_HEAD`

```text

```

### 文件路径: `.git\HEAD`

```text
ref: refs/heads/master
```

### 文件路径: `.git\hooks\applypatch-msg.sample`

```text
#!/bin/sh
#
# An example hook script to check the commit log message taken by
# applypatch from an e-mail message.
#
# The hook should exit with non-zero status after issuing an
# appropriate message if it wants to stop the commit.  The hook is
# allowed to edit the commit message file.
#
# To enable this hook, rename this file to "applypatch-msg".

. git-sh-setup
commitmsg="$(git rev-parse --git-path hooks/commit-msg)"
test -x "$commitmsg" && exec "$commitmsg" ${1+"$@"}
:
```

### 文件路径: `.git\hooks\commit-msg.sample`

```text
#!/bin/sh
#
# An example hook script to check the commit log message.
# Called by "git commit" with one argument, the name of the file
# that has the commit message.  The hook should exit with non-zero
# status after issuing an appropriate message if it wants to stop the
# commit.  The hook is allowed to edit the commit message file.
#
# To enable this hook, rename this file to "commit-msg".

# Uncomment the below to add a Signed-off-by line to the message.
# Doing this in a hook is a bad idea in general, but the prepare-commit-msg
# hook is more suited to it.
#
# SOB=$(git var GIT_AUTHOR_IDENT | sed -n 's/^\(.*>\).*$/Signed-off-by: \1/p')
# grep -qs "^$SOB" "$1" || echo "$SOB" >> "$1"

# This example catches duplicate Signed-off-by lines.

test "" = "$(grep '^Signed-off-by: ' "$1" |
	 sort | uniq -c | sed -e '/^[ 	]*1[ 	]/d')" || {
	echo >&2 Duplicate Signed-off-by lines.
	exit 1
}
```

### 文件路径: `.git\hooks\fsmonitor-watchman.sample`

```text
#!/usr/bin/perl

use strict;
use warnings;
use IPC::Open2;

# An example hook script to integrate Watchman
# (https://facebook.github.io/watchman/) with git to speed up detecting
# new and modified files.
#
# The hook is passed a version (currently 2) and last update token
# formatted as a string and outputs to stdout a new update token and
# all files that have been modified since the update token. Paths must
# be relative to the root of the working tree and separated by a single NUL.
#
# To enable this hook, rename this file to "query-watchman" and set
# 'git config core.fsmonitor .git/hooks/query-watchman'
#
my ($version, $last_update_token) = @ARGV;

# Uncomment for debugging
# print STDERR "$0 $version $last_update_token\n";

# Check the hook interface version
if ($version ne 2) {
	die "Unsupported query-fsmonitor hook version '$version'.\n" .
	    "Falling back to scanning...\n";
}

my $git_work_tree = get_working_dir();

my $retry = 1;

my $json_pkg;
eval {
	require JSON::XS;
	$json_pkg = "JSON::XS";
	1;
} or do {
	require JSON::PP;
	$json_pkg = "JSON::PP";
};

launch_watchman();

sub launch_watchman {
	my $o = watchman_query();
	if (is_work_tree_watched($o)) {
		output_result($o->{clock}, @{$o->{files}});
	}
}

sub output_result {
	my ($clockid, @files) = @_;

	# Uncomment for debugging watchman output
	# open (my $fh, ">", ".git/watchman-output.out");
	# binmode $fh, ":utf8";
	# print $fh "$clockid\n@files\n";
	# close $fh;

	binmode STDOUT, ":utf8";
	print $clockid;
	print "\0";
	local $, = "\0";
	print @files;
}

sub watchman_clock {
	my $response = qx/watchman clock "$git_work_tree"/;
	die "Failed to get clock id on '$git_work_tree'.\n" .
		"Falling back to scanning...\n" if $? != 0;

	return $json_pkg->new->utf8->decode($response);
}

sub watchman_query {
	my $pid = open2(\*CHLD_OUT, \*CHLD_IN, 'watchman -j --no-pretty')
	or die "open2() failed: $!\n" .
	"Falling back to scanning...\n";

	# In the query expression below we're asking for names of files that
	# changed since $last_update_token but not from the .git folder.
	#
	# To accomplish this, we're using the "since" generator to use the
	# recency index to select candidate nodes and "fields" to limit the
	# output to file names only. Then we're using the "expression" term to
	# further constrain the results.
	my $last_update_line = "";
	if (substr($last_update_token, 0, 1) eq "c") {
		$last_update_token = "\"$last_update_token\"";
		$last_update_line = qq[\n"since": $last_update_token,];
	}
	my $query = <<"	END";
		["query", "$git_work_tree", {$last_update_line
			"fields": ["name"],
			"expression": ["not", ["dirname", ".git"]]
		}]
	END

	# Uncomment for debugging the watchman query
	# open (my $fh, ">", ".git/watchman-query.json");
	# print $fh $query;
	# close $fh;

	print CHLD_IN $query;
	close CHLD_IN;
	my $response = do {local $/; <CHLD_OUT>};

	# Uncomment for debugging the watch response
	# open ($fh, ">", ".git/watchman-response.json");
	# print $fh $response;
	# close $fh;

	die "Watchman: command returned no output.\n" .
	"Falling back to scanning...\n" if $response eq "";
	die "Watchman: command returned invalid output: $response\n" .
	"Falling back to scanning...\n" unless $response =~ /^\{/;

	return $json_pkg->new->utf8->decode($response);
}

sub is_work_tree_watched {
	my ($output) = @_;
	my $error = $output->{error};
	if ($retry > 0 and $error and $error =~ m/unable to resolve root .* directory (.*) is not watched/) {
		$retry--;
		my $response = qx/watchman watch "$git_work_tree"/;
		die "Failed to make watchman watch '$git_work_tree'.\n" .
		    "Falling back to scanning...\n" if $? != 0;
		$output = $json_pkg->new->utf8->decode($response);
		$error = $output->{error};
		die "Watchman: $error.\n" .
		"Falling back to scanning...\n" if $error;

		# Uncomment for debugging watchman output
		# open (my $fh, ">", ".git/watchman-output.out");
		# close $fh;

		# Watchman will always return all files on the first query so
		# return the fast "everything is dirty" flag to git and do the
		# Watchman query just to get it over with now so we won't pay
		# the cost in git to look up each individual file.
		my $o = watchman_clock();
		$error = $output->{error};

		die "Watchman: $error.\n" .
		"Falling back to scanning...\n" if $error;

		output_result($o->{clock}, ("/"));
		$last_update_token = $o->{clock};

		eval { launch_watchman() };
		return 0;
	}

	die "Watchman: $error.\n" .
	"Falling back to scanning...\n" if $error;

	return 1;
}

sub get_working_dir {
	my $working_dir;
	if ($^O =~ 'msys' || $^O =~ 'cygwin') {
		$working_dir = Win32::GetCwd();
		$working_dir =~ tr/\\/\//;
	} else {
		require Cwd;
		$working_dir = Cwd::cwd();
	}

	return $working_dir;
}
```

### 文件路径: `.git\hooks\post-update.sample`

```text
#!/bin/sh
#
# An example hook script to prepare a packed repository for use over
# dumb transports.
#
# To enable this hook, rename this file to "post-update".

exec git update-server-info
```

### 文件路径: `.git\hooks\pre-applypatch.sample`

```text
#!/bin/sh
#
# An example hook script to verify what is about to be committed
# by applypatch from an e-mail message.
#
# The hook should exit with non-zero status after issuing an
# appropriate message if it wants to stop the commit.
#
# To enable this hook, rename this file to "pre-applypatch".

. git-sh-setup
precommit="$(git rev-parse --git-path hooks/pre-commit)"
test -x "$precommit" && exec "$precommit" ${1+"$@"}
:
```

### 文件路径: `.git\hooks\pre-commit.sample`

```text
#!/bin/sh
#
# An example hook script to verify what is about to be committed.
# Called by "git commit" with no arguments.  The hook should
# exit with non-zero status after issuing an appropriate message if
# it wants to stop the commit.
#
# To enable this hook, rename this file to "pre-commit".

if git rev-parse --verify HEAD >/dev/null 2>&1
then
	against=HEAD
else
	# Initial commit: diff against an empty tree object
	against=$(git hash-object -t tree /dev/null)
fi

# If you want to allow non-ASCII filenames set this variable to true.
allownonascii=$(git config --type=bool hooks.allownonascii)

# Redirect output to stderr.
exec 1>&2

# Cross platform projects tend to avoid non-ASCII filenames; prevent
# them from being added to the repository. We exploit the fact that the
# printable range starts at the space character and ends with tilde.
if [ "$allownonascii" != "true" ] &&
	# Note that the use of brackets around a tr range is ok here, (it's
	# even required, for portability to Solaris 10's /usr/bin/tr), since
	# the square bracket bytes happen to fall in the designated range.
	test $(git diff-index --cached --name-only --diff-filter=A -z $against |
	  LC_ALL=C tr -d '[ -~]\0' | wc -c) != 0
then
	cat <<\EOF
Error: Attempt to add a non-ASCII file name.

This can cause problems if you want to work with people on other platforms.

To be portable it is advisable to rename the file.

If you know what you are doing you can disable this check using:

  git config hooks.allownonascii true
EOF
	exit 1
fi

# If there are whitespace errors, print the offending file names and fail.
exec git diff-index --check --cached $against --
```

### 文件路径: `.git\hooks\pre-merge-commit.sample`

```text
#!/bin/sh
#
# An example hook script to verify what is about to be committed.
# Called by "git merge" with no arguments.  The hook should
# exit with non-zero status after issuing an appropriate message to
# stderr if it wants to stop the merge commit.
#
# To enable this hook, rename this file to "pre-merge-commit".

. git-sh-setup
test -x "$GIT_DIR/hooks/pre-commit" &&
        exec "$GIT_DIR/hooks/pre-commit"
:
```

### 文件路径: `.git\hooks\pre-push.sample`

```text
#!/bin/sh

# An example hook script to verify what is about to be pushed.  Called by "git
# push" after it has checked the remote status, but before anything has been
# pushed.  If this script exits with a non-zero status nothing will be pushed.
#
# This hook is called with the following parameters:
#
# $1 -- Name of the remote to which the push is being done
# $2 -- URL to which the push is being done
#
# If pushing without using a named remote those arguments will be equal.
#
# Information about the commits which are being pushed is supplied as lines to
# the standard input in the form:
#
#   <local ref> <local oid> <remote ref> <remote oid>
#
# This sample shows how to prevent push of commits where the log message starts
# with "WIP" (work in progress).

remote="$1"
url="$2"

zero=$(git hash-object --stdin </dev/null | tr '[0-9a-f]' '0')

while read local_ref local_oid remote_ref remote_oid
do
	if test "$local_oid" = "$zero"
	then
		# Handle delete
		:
	else
		if test "$remote_oid" = "$zero"
		then
			# New branch, examine all commits
			range="$local_oid"
		else
			# Update to existing branch, examine new commits
			range="$remote_oid..$local_oid"
		fi

		# Check for WIP commit
		commit=$(git rev-list -n 1 --grep '^WIP' "$range")
		if test -n "$commit"
		then
			echo >&2 "Found WIP commit in $local_ref, not pushing"
			exit 1
		fi
	fi
done

exit 0
```

### 文件路径: `.git\hooks\pre-rebase.sample`

```text
#!/bin/sh
#
# Copyright (c) 2006, 2008 Junio C Hamano
#
# The "pre-rebase" hook is run just before "git rebase" starts doing
# its job, and can prevent the command from running by exiting with
# non-zero status.
#
# The hook is called with the following parameters:
#
# $1 -- the upstream the series was forked from.
# $2 -- the branch being rebased (or empty when rebasing the current branch).
#
# This sample shows how to prevent topic branches that are already
# merged to 'next' branch from getting rebased, because allowing it
# would result in rebasing already published history.

publish=next
basebranch="$1"
if test "$#" = 2
then
	topic="refs/heads/$2"
else
	topic=`git symbolic-ref HEAD` ||
	exit 0 ;# we do not interrupt rebasing detached HEAD
fi

case "$topic" in
refs/heads/??/*)
	;;
*)
	exit 0 ;# we do not interrupt others.
	;;
esac

# Now we are dealing with a topic branch being rebased
# on top of master.  Is it OK to rebase it?

# Does the topic really exist?
git show-ref -q "$topic" || {
	echo >&2 "No such branch $topic"
	exit 1
}

# Is topic fully merged to master?
not_in_master=`git rev-list --pretty=oneline ^master "$topic"`
if test -z "$not_in_master"
then
	echo >&2 "$topic is fully merged to master; better remove it."
	exit 1 ;# we could allow it, but there is no point.
fi

# Is topic ever merged to next?  If so you should not be rebasing it.
only_next_1=`git rev-list ^master "^$topic" ${publish} | sort`
only_next_2=`git rev-list ^master           ${publish} | sort`
if test "$only_next_1" = "$only_next_2"
then
	not_in_topic=`git rev-list "^$topic" master`
	if test -z "$not_in_topic"
	then
		echo >&2 "$topic is already up to date with master"
		exit 1 ;# we could allow it, but there is no point.
	else
		exit 0
	fi
else
	not_in_next=`git rev-list --pretty=oneline ^${publish} "$topic"`
	/usr/bin/perl -e '
		my $topic = $ARGV[0];
		my $msg = "* $topic has commits already merged to public branch:\n";
		my (%not_in_next) = map {
			/^([0-9a-f]+) /;
			($1 => 1);
		} split(/\n/, $ARGV[1]);
		for my $elem (map {
				/^([0-9a-f]+) (.*)$/;
				[$1 => $2];
			} split(/\n/, $ARGV[2])) {
			if (!exists $not_in_next{$elem->[0]}) {
				if ($msg) {
					print STDERR $msg;
					undef $msg;
				}
				print STDERR " $elem->[1]\n";
			}
		}
	' "$topic" "$not_in_next" "$not_in_master"
	exit 1
fi

<<\DOC_END

This sample hook safeguards topic branches that have been
published from being rewound.

The workflow assumed here is:

 * Once a topic branch forks from "master", "master" is never
   merged into it again (either directly or indirectly).

 * Once a topic branch is fully cooked and merged into "master",
   it is deleted.  If you need to build on top of it to correct
   earlier mistakes, a new topic branch is created by forking at
   the tip of the "master".  This is not strictly necessary, but
   it makes it easier to keep your history simple.

 * Whenever you need to test or publish your changes to topic
   branches, merge them into "next" branch.

The script, being an example, hardcodes the publish branch name
to be "next", but it is trivial to make it configurable via
$GIT_DIR/config mechanism.

With this workflow, you would want to know:

(1) ... if a topic branch has ever been merged to "next".  Young
    topic branches can have stupid mistakes you would rather
    clean up before publishing, and things that have not been
    merged into other branches can be easily rebased without
    affecting other people.  But once it is published, you would
    not want to rewind it.

(2) ... if a topic branch has been fully merged to "master".
    Then you can delete it.  More importantly, you should not
    build on top of it -- other people may already want to
    change things related to the topic as patches against your
    "master", so if you need further changes, it is better to
    fork the topic (perhaps with the same name) afresh from the
    tip of "master".

Let's look at this example:

		   o---o---o---o---o---o---o---o---o---o "next"
		  /       /           /           /
		 /   a---a---b A     /           /
		/   /               /           /
	       /   /   c---c---c---c B         /
	      /   /   /             \         /
	     /   /   /   b---b C     \       /
	    /   /   /   /             \     /
    ---o---o---o---o---o---o---o---o---o---o---o "master"


A, B and C are topic branches.

 * A has one fix since it was merged up to "next".

 * B has finished.  It has been fully merged up to "master" and "next",
   and is ready to be deleted.

 * C has not merged to "next" at all.

We would want to allow C to be rebased, refuse A, and encourage
B to be deleted.

To compute (1):

	git rev-list ^master ^topic next
	git rev-list ^master        next

	if these match, topic has not merged in next at all.

To compute (2):

	git rev-list master..topic

	if this is empty, it is fully merged to "master".

DOC_END
```

### 文件路径: `.git\hooks\pre-receive.sample`

```text
#!/bin/sh
#
# An example hook script to make use of push options.
# The example simply echoes all push options that start with 'echoback='
# and rejects all pushes when the "reject" push option is used.
#
# To enable this hook, rename this file to "pre-receive".

if test -n "$GIT_PUSH_OPTION_COUNT"
then
	i=0
	while test "$i" -lt "$GIT_PUSH_OPTION_COUNT"
	do
		eval "value=\$GIT_PUSH_OPTION_$i"
		case "$value" in
		echoback=*)
			echo "echo from the pre-receive-hook: ${value#*=}" >&2
			;;
		reject)
			exit 1
		esac
		i=$((i + 1))
	done
fi
```

### 文件路径: `.git\hooks\prepare-commit-msg.sample`

```text
#!/bin/sh
#
# An example hook script to prepare the commit log message.
# Called by "git commit" with the name of the file that has the
# commit message, followed by the description of the commit
# message's source.  The hook's purpose is to edit the commit
# message file.  If the hook fails with a non-zero status,
# the commit is aborted.
#
# To enable this hook, rename this file to "prepare-commit-msg".

# This hook includes three examples. The first one removes the
# "# Please enter the commit message..." help message.
#
# The second includes the output of "git diff --name-status -r"
# into the message, just before the "git status" output.  It is
# commented because it doesn't cope with --amend or with squashed
# commits.
#
# The third example adds a Signed-off-by line to the message, that can
# still be edited.  This is rarely a good idea.

COMMIT_MSG_FILE=$1
COMMIT_SOURCE=$2
SHA1=$3

/usr/bin/perl -i.bak -ne 'print unless(m/^. Please enter the commit message/..m/^#$/)' "$COMMIT_MSG_FILE"

# case "$COMMIT_SOURCE,$SHA1" in
#  ,|template,)
#    /usr/bin/perl -i.bak -pe '
#       print "\n" . `git diff --cached --name-status -r`
# 	 if /^#/ && $first++ == 0' "$COMMIT_MSG_FILE" ;;
#  *) ;;
# esac

# SOB=$(git var GIT_COMMITTER_IDENT | sed -n 's/^\(.*>\).*$/Signed-off-by: \1/p')
# git interpret-trailers --in-place --trailer "$SOB" "$COMMIT_MSG_FILE"
# if test -z "$COMMIT_SOURCE"
# then
#   /usr/bin/perl -i.bak -pe 'print "\n" if !$first_line++' "$COMMIT_MSG_FILE"
# fi
```

### 文件路径: `.git\hooks\push-to-checkout.sample`

```text
#!/bin/sh

# An example hook script to update a checked-out tree on a git push.
#
# This hook is invoked by git-receive-pack(1) when it reacts to git
# push and updates reference(s) in its repository, and when the push
# tries to update the branch that is currently checked out and the
# receive.denyCurrentBranch configuration variable is set to
# updateInstead.
#
# By default, such a push is refused if the working tree and the index
# of the remote repository has any difference from the currently
# checked out commit; when both the working tree and the index match
# the current commit, they are updated to match the newly pushed tip
# of the branch. This hook is to be used to override the default
# behaviour; however the code below reimplements the default behaviour
# as a starting point for convenient modification.
#
# The hook receives the commit with which the tip of the current
# branch is going to be updated:
commit=$1

# It can exit with a non-zero status to refuse the push (when it does
# so, it must not modify the index or the working tree).
die () {
	echo >&2 "$*"
	exit 1
}

# Or it can make any necessary changes to the working tree and to the
# index to bring them to the desired state when the tip of the current
# branch is updated to the new commit, and exit with a zero status.
#
# For example, the hook can simply run git read-tree -u -m HEAD "$1"
# in order to emulate git fetch that is run in the reverse direction
# with git push, as the two-tree form of git read-tree -u -m is
# essentially the same as git switch or git checkout that switches
# branches while keeping the local changes in the working tree that do
# not interfere with the difference between the branches.

# The below is a more-or-less exact translation to shell of the C code
# for the default behaviour for git's push-to-checkout hook defined in
# the push_to_deploy() function in builtin/receive-pack.c.
#
# Note that the hook will be executed from the repository directory,
# not from the working tree, so if you want to perform operations on
# the working tree, you will have to adapt your code accordingly, e.g.
# by adding "cd .." or using relative paths.

if ! git update-index -q --ignore-submodules --refresh
then
	die "Up-to-date check failed"
fi

if ! git diff-files --quiet --ignore-submodules --
then
	die "Working directory has unstaged changes"
fi

# This is a rough translation of:
#
#   head_has_history() ? "HEAD" : EMPTY_TREE_SHA1_HEX
if git cat-file -e HEAD 2>/dev/null
then
	head=HEAD
else
	head=$(git hash-object -t tree --stdin </dev/null)
fi

if ! git diff-index --quiet --cached --ignore-submodules $head --
then
	die "Working directory has staged changes"
fi

if ! git read-tree -u -m "$commit"
then
	die "Could not update working tree to new HEAD"
fi
```

### 文件路径: `.git\hooks\sendemail-validate.sample`

```text
#!/bin/sh

# An example hook script to validate a patch (and/or patch series) before
# sending it via email.
#
# The hook should exit with non-zero status after issuing an appropriate
# message if it wants to prevent the email(s) from being sent.
#
# To enable this hook, rename this file to "sendemail-validate".
#
# By default, it will only check that the patch(es) can be applied on top of
# the default upstream branch without conflicts in a secondary worktree. After
# validation (successful or not) of the last patch of a series, the worktree
# will be deleted.
#
# The following config variables can be set to change the default remote and
# remote ref that are used to apply the patches against:
#
#   sendemail.validateRemote (default: origin)
#   sendemail.validateRemoteRef (default: HEAD)
#
# Replace the TODO placeholders with appropriate checks according to your
# needs.

validate_cover_letter () {
	file="$1"
	# TODO: Replace with appropriate checks (e.g. spell checking).
	true
}

validate_patch () {
	file="$1"
	# Ensure that the patch applies without conflicts.
	git am -3 "$file" || return
	# TODO: Replace with appropriate checks for this patch
	# (e.g. checkpatch.pl).
	true
}

validate_series () {
	# TODO: Replace with appropriate checks for the whole series
	# (e.g. quick build, coding style checks, etc.).
	true
}

# main -------------------------------------------------------------------------

if test "$GIT_SENDEMAIL_FILE_COUNTER" = 1
then
	remote=$(git config --default origin --get sendemail.validateRemote) &&
	ref=$(git config --default HEAD --get sendemail.validateRemoteRef) &&
	worktree=$(mktemp --tmpdir -d sendemail-validate.XXXXXXX) &&
	git worktree add -fd --checkout "$worktree" "refs/remotes/$remote/$ref" &&
	git config --replace-all sendemail.validateWorktree "$worktree"
else
	worktree=$(git config --get sendemail.validateWorktree)
fi || {
	echo "sendemail-validate: error: failed to prepare worktree" >&2
	exit 1
}

unset GIT_DIR GIT_WORK_TREE
cd "$worktree" &&

if grep -q "^diff --git " "$1"
then
	validate_patch "$1"
else
	validate_cover_letter "$1"
fi &&

if test "$GIT_SENDEMAIL_FILE_COUNTER" = "$GIT_SENDEMAIL_FILE_TOTAL"
then
	git config --unset-all sendemail.validateWorktree &&
	trap 'git worktree remove -ff "$worktree"' EXIT &&
	validate_series
fi
```

### 文件路径: `.git\hooks\update.sample`

```text
#!/bin/sh
#
# An example hook script to block unannotated tags from entering.
# Called by "git receive-pack" with arguments: refname sha1-old sha1-new
#
# To enable this hook, rename this file to "update".
#
# Config
# ------
# hooks.allowunannotated
#   This boolean sets whether unannotated tags will be allowed into the
#   repository.  By default they won't be.
# hooks.allowdeletetag
#   This boolean sets whether deleting tags will be allowed in the
#   repository.  By default they won't be.
# hooks.allowmodifytag
#   This boolean sets whether a tag may be modified after creation. By default
#   it won't be.
# hooks.allowdeletebranch
#   This boolean sets whether deleting branches will be allowed in the
#   repository.  By default they won't be.
# hooks.denycreatebranch
#   This boolean sets whether remotely creating branches will be denied
#   in the repository.  By default this is allowed.
#

# --- Command line
refname="$1"
oldrev="$2"
newrev="$3"

# --- Safety check
if [ -z "$GIT_DIR" ]; then
	echo "Don't run this script from the command line." >&2
	echo " (if you want, you could supply GIT_DIR then run" >&2
	echo "  $0 <ref> <oldrev> <newrev>)" >&2
	exit 1
fi

if [ -z "$refname" -o -z "$oldrev" -o -z "$newrev" ]; then
	echo "usage: $0 <ref> <oldrev> <newrev>" >&2
	exit 1
fi

# --- Config
allowunannotated=$(git config --type=bool hooks.allowunannotated)
allowdeletebranch=$(git config --type=bool hooks.allowdeletebranch)
denycreatebranch=$(git config --type=bool hooks.denycreatebranch)
allowdeletetag=$(git config --type=bool hooks.allowdeletetag)
allowmodifytag=$(git config --type=bool hooks.allowmodifytag)

# check for no description
projectdesc=$(sed -e '1q' "$GIT_DIR/description")
case "$projectdesc" in
"Unnamed repository"* | "")
	echo "*** Project description file hasn't been set" >&2
	exit 1
	;;
esac

# --- Check types
# if $newrev is 0000...0000, it's a commit to delete a ref.
zero=$(git hash-object --stdin </dev/null | tr '[0-9a-f]' '0')
if [ "$newrev" = "$zero" ]; then
	newrev_type=delete
else
	newrev_type=$(git cat-file -t $newrev)
fi

case "$refname","$newrev_type" in
	refs/tags/*,commit)
		# un-annotated tag
		short_refname=${refname##refs/tags/}
		if [ "$allowunannotated" != "true" ]; then
			echo "*** The un-annotated tag, $short_refname, is not allowed in this repository" >&2
			echo "*** Use 'git tag [ -a | -s ]' for tags you want to propagate." >&2
			exit 1
		fi
		;;
	refs/tags/*,delete)
		# delete tag
		if [ "$allowdeletetag" != "true" ]; then
			echo "*** Deleting a tag is not allowed in this repository" >&2
			exit 1
		fi
		;;
	refs/tags/*,tag)
		# annotated tag
		if [ "$allowmodifytag" != "true" ] && git rev-parse $refname > /dev/null 2>&1
		then
			echo "*** Tag '$refname' already exists." >&2
			echo "*** Modifying a tag is not allowed in this repository." >&2
			exit 1
		fi
		;;
	refs/heads/*,commit)
		# branch
		if [ "$oldrev" = "$zero" -a "$denycreatebranch" = "true" ]; then
			echo "*** Creating a branch is not allowed in this repository" >&2
			exit 1
		fi
		;;
	refs/heads/*,delete)
		# delete branch
		if [ "$allowdeletebranch" != "true" ]; then
			echo "*** Deleting a branch is not allowed in this repository" >&2
			exit 1
		fi
		;;
	refs/remotes/*,commit)
		# tracking branch
		;;
	refs/remotes/*,delete)
		# delete tracking branch
		if [ "$allowdeletebranch" != "true" ]; then
			echo "*** Deleting a tracking branch is not allowed in this repository" >&2
			exit 1
		fi
		;;
	*)
		# Anything else (is there anything else?)
		echo "*** Update hook: unknown type of update to ref $refname of type $newrev_type" >&2
		exit 1
		;;
esac

# --- Finished
exit 0
```

### 文件路径: `.git\info\exclude`

```text
# git ls-files --others --exclude-from=.git/info/exclude
# Lines that start with '#' are comments.
# For a project mostly in C, the following would be a good set of
# exclude patterns (uncomment them if you want to use them):
# *.[oa]
# *~
```

### 文件路径: `js\admin.ts`

```typescript
export * from './src/common';
export * from './src/admin';
```

### 文件路径: `js\forum.ts`

```typescript
export * from './src/common';
export * from './src/forum';
```

### 文件路径: `js\package.json`

```json
{
    "name": "@shebaoting/dependency-collector",
    "private": true,
    "version": "0.0.0",
    "devDependencies": {
        "flarum-webpack-config": "^2.0.0",
        "webpack": "^5.65.0",
        "webpack-cli": "^4.9.1",
        "prettier": "^2.5.1",
        "@flarum/prettier-config": "^1.0.0",
        "flarum-tsconfig": "^1.0.2",
        "typescript": "^4.5.4",
        "typescript-coverage-report": "^0.6.1"
    },
    "scripts": {
        "dev": "webpack --mode development --watch",
        "build": "webpack --mode production",
        "analyze": "cross-env ANALYZER=true yarn run build",
        "format": "prettier --write src",
        "format-check": "prettier --check src",
        "clean-typings": "npx rimraf dist-typings && mkdir dist-typings",
        "build-typings": "yarn run clean-typings && ([ -e src/@types ] && cp -r src/@types dist-typings/@types || true) && tsc && yarn run post-build-typings",
        "post-build-typings": "find dist-typings -type f -name '*.d.ts' -print0 | xargs -0 sed -i 's,../src/@types,@types,g'",
        "check-typings": "tsc --noEmit --emitDeclarationOnly false",
        "check-typings-coverage": "typescript-coverage-report"
    },
    "prettier": "@flarum/prettier-config",
    "packageManager": "yarn@1.22.22+sha512.a6b2f7906b721bba3d67d4aff083df04dad64c399707841b7acf00f6b133b7ac24255f2652fa22ae3534329dc6180534e98d17432037ff6fd140556e2bb3137e"
}
```

### 文件路径: `js\src\admin\index.ts`

```typescript
import app from 'flarum/admin/app';
import DependencyCollectorSettingsPage from './components/DependencyCollectorSettingsPage'; // We will create this
import DependencyItem from '../common/models/DependencyItem'; // If needed in admin
import DependencyTag from '../common/models/DependencyTag'; // If needed in admin

app.initializers.add('shebaoting-dependency-collector-admin', () => {
  app.store.models['dependency-items'] = DependencyItem;
  app.store.models['dependency-tags'] = DependencyTag;

  // Register your extension page
  app.extensionData
    .for('shebaoting-dependency-collector')
    .registerPage(DependencyCollectorSettingsPage)
    .registerPermission(
      {
        icon: 'fas fa-pencil-alt', // Example icon
        label: app.translator.trans('shebaoting-dependency-collector.admin.permissions.submit_label'),
        permission: 'dependency-collector.submit',
      },
      'start' // Permission group: start, moderate, etc.
    )
    .registerPermission(
      {
        icon: 'fas fa-check-double',
        label: app.translator.trans('shebaoting-dependency-collector.admin.permissions.moderate_label'),
        permission: 'dependency-collector.moderate',
        allowGuest: false, // Example: Don't allow guests
      },
      'moderate'
    )
    .registerPermission(
      {
        icon: 'fas fa-tags',
        label: app.translator.trans('shebaoting-dependency-collector.admin.permissions.manage_tags_label'),
        permission: 'dependency-collector.manageTags',
      },
      'moderate' // Or a new group like 'manage'
    );
  // Add more permissions as needed
});
```

### 文件路径: `js\src\admin\components\DependencyCollectorSettingsPage.js`

```javascript
import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import EditTagModal from './EditTagModal'; // We'll create this
import ItemList from 'flarum/common/utils/ItemList';
import humanTime from 'flarum/common/utils/humanTime';

export default class DependencyCollectorSettingsPage extends ExtensionPage {
  oninit(vnode) {
    super.oninit(vnode);
    this.loadingPending = true;
    this.loadingApproved = true;
    this.loadingTags = true;

    this.pendingItems = [];
    this.approvedItems = [];
    this.pluginTags = [];

    this.loadPendingItems();
    this.loadApprovedItems();
    this.loadPluginTags();
  }

  content() {
    return (
      <div className="DependencyCollectorSettingsPage">
        {/* Section for settings if you add any */}
        {/* this.buildSettingComponent({ ... }) */}

        <div className="container">
          {this.pendingItemsSection()}
          {this.approvedItemsSection()}
          {this.pluginTagsSection()}
        </div>
      </div>
    );
  }

  pendingItemsSection() {
    return (
      <section className="PendingItemsSection">
        <h2>{app.translator.trans('shebaoting-dependency-collector.admin.page.pending_items_title')}</h2>
        {this.loadingPending ? (
          <LoadingIndicator />
        ) : this.pendingItems.length === 0 ? (
          <p>{app.translator.trans('shebaoting-dependency-collector.admin.page.no_pending_items')}</p>
        ) : (
          <table className="Table DependencyTable">
            <thead>
              <tr>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.title')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.submitted_by')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.submitted_at')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.tags')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.actions')}</th>
              </tr>
            </thead>
            <tbody>{this.pendingItems.map((item) => this.itemRow(item, true))}</tbody>
          </table>
        )}
      </section>
    );
  }

  approvedItemsSection() {
    return (
      <section className="ApprovedItemsSection">
        <h2>{app.translator.trans('shebaoting-dependency-collector.admin.page.approved_items_title')}</h2>
        {this.loadingApproved ? (
          <LoadingIndicator />
        ) : this.approvedItems.length === 0 ? (
          <p>{app.translator.trans('shebaoting-dependency-collector.admin.page.no_approved_items')}</p>
        ) : (
          <table className="Table DependencyTable">
            <thead>
              <tr>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.title')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.approved_by')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.approved_at')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.tags')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.actions')}</th>
              </tr>
            </thead>
            <tbody>{this.approvedItems.map((item) => this.itemRow(item, false))}</tbody>
          </table>
        )}
      </section>
    );
  }

  itemRow(item, isPending) {
    const submitter = item.user();
    const approver = item.approver();

    return (
      <tr key={item.id()}>
        <td>
          <a href={item.link()} target="_blank">
            {item.title()}
          </a>
          <br />
          <small>{item.description()}</small>
        </td>
        <td>{submitter ? submitter.username() : 'N/A'}</td>
        <td>{isPending ? humanTime(item.submittedAt()) : approver ? approver.username() : 'N/A'}</td>
        <td>
          {isPending
            ? item.tags()
              ? item
                  .tags()
                  .map((t) => t.name())
                  .join(', ')
              : ''
            : humanTime(item.approvedAt())}
        </td>
        <td>
          {isPending && (
            <Button className="Button Button--icon" icon="fas fa-edit" onclick={() => this.editItem(item, true)}>
              {app.translator.trans('core.admin.basics.edit_button')}
            </Button>
          )}
          {!isPending && (
            <Button className="Button Button--icon" icon="fas fa-edit" onclick={() => this.editItem(item, false)}>
              {app.translator.trans('core.admin.basics.edit_button')}
            </Button>
          )}
          {/* In a real app, EditItemModal would handle approve/reject for pending items */}
          {isPending && (
            <Button className="Button Button--icon Button--success" icon="fas fa-check" onclick={() => this.updateItemStatus(item, 'approved')}>
              {app.translator.trans('shebaoting-dependency-collector.admin.actions.approve')}
            </Button>
          )}
          {isPending && (
            <Button className="Button Button--icon Button--danger" icon="fas fa-times" onclick={() => this.updateItemStatus(item, 'rejected')}>
              {app.translator.trans('shebaoting-dependency-collector.admin.actions.reject')}
            </Button>
          )}
          <Button className="Button Button--icon Button--danger" icon="fas fa-trash" onclick={() => this.deleteItem(item, isPending)}>
            {app.translator.trans('core.admin.basics.delete_button')}
          </Button>
        </td>
      </tr>
    );
  }

  // Placeholder for edit item modal
  editItem(item, isPending) {
    // app.modal.show(EditDependencyItemModal, { item, isPending, onsave: isPending ? this.loadPendingItems.bind(this) : this.loadApprovedItems.bind(this) });
    alert('Edit functionality to be implemented. Item ID: ' + item.id());
  }

  updateItemStatus(item, status) {
    if (
      !confirm(
        app.translator.trans(
          status === 'approved' ? 'shebaoting-dependency-collector.admin.confirm.approve' : 'shebaoting-dependency-collector.admin.confirm.reject'
        ) + ` "${item.title()}"?`
      )
    )
      return;

    item
      .save({ status: status })
      .then(() => {
        this.loadPendingItems(); // Refresh list
        this.loadApprovedItems();
        m.redraw();
      })
      .catch((e) => {
        console.error(e);
        alert('Error updating status.');
      });
  }

  deleteItem(item, isPendingList) {
    if (!confirm(app.translator.trans('shebaoting-dependency-collector.admin.confirm.delete') + ` "${item.title()}"?`)) return;

    item
      .delete()
      .then(() => {
        if (isPendingList) this.loadPendingItems();
        else this.loadApprovedItems();
        m.redraw();
      })
      .catch((e) => {
        console.error(e);
        alert('Error deleting item.');
      });
  }

  pluginTagsSection() {
    return (
      <section className="PluginTagsSection">
        <h2>{app.translator.trans('shebaoting-dependency-collector.admin.page.manage_tags_title')}</h2>
        <Button
          className="Button Button--primary"
          icon="fas fa-plus"
          onclick={() => app.modal.show(EditTagModal, { onsave: this.loadPluginTags.bind(this) })}
        >
          {app.translator.trans('shebaoting-dependency-collector.admin.actions.create_tag')}
        </Button>
        {this.loadingTags ? (
          <LoadingIndicator />
        ) : this.pluginTags.length === 0 ? (
          <p>{app.translator.trans('shebaoting-dependency-collector.admin.page.no_plugin_tags')}</p>
        ) : (
          <table className="Table PluginTagsTable">
            <thead>
              <tr>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.tag_name')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.tag_slug')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.tag_color_icon')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.tag_item_count')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {this.pluginTags.map((tag) => (
                <tr key={tag.id()}>
                  <td>{tag.name()}</td>
                  <td>{tag.slug()}</td>
                  <td>
                    {tag.color() && (
                      <span style={{ backgroundColor: tag.color(), padding: '2px 5px', color: 'white', borderRadius: '3px', marginRight: '5px' }}>
                        {tag.color()}
                      </span>
                    )}
                    {tag.icon() && <i className={tag.icon()}></i>}
                  </td>
                  <td>{tag.itemCount()}</td>
                  <td>
                    <Button
                      className="Button Button--icon"
                      icon="fas fa-edit"
                      onclick={() => app.modal.show(EditTagModal, { tag, onsave: this.loadPluginTags.bind(this) })}
                    />
                    <Button className="Button Button--icon Button--danger" icon="fas fa-trash" onclick={() => this.deleteTag(tag)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    );
  }

  loadPendingItems() {
    this.loadingPending = true;
    app.store.find('dependency-items', { filter: { status: 'pending' }, sort: '-submittedAt' }).then((items) => {
      this.pendingItems = items;
      this.loadingPending = false;
      m.redraw();
    });
  }
  loadApprovedItems() {
    this.loadingApproved = true;
    app.store.find('dependency-items', { filter: { status: 'approved' }, sort: '-approvedAt' }).then((items) => {
      this.approvedItems = items;
      this.loadingApproved = false;
      m.redraw();
    });
  }

  loadPluginTags() {
    this.loadingTags = true;
    app.store.find('dependency-tags', { sort: 'name' }).then((tags) => {
      this.pluginTags = tags;
      this.loadingTags = false;
      m.redraw();
    });
  }

  deleteTag(tag) {
    if (!confirm(app.translator.trans('shebaoting-dependency-collector.admin.confirm.delete_tag', { name: tag.name() }))) return;

    tag
      .delete()
      .then(() => {
        this.loadPluginTags(); // Refresh list
        m.redraw();
      })
      .catch((e) => {
        console.error(e);
        alert('Error deleting tag.'); // Proper error handling needed
      });
  }
}
```

### 文件路径: `js\src\admin\components\EditTagModal.js`

```javascript
import Modal from 'flarum/admin/components/Modal'; // 确保从 'flarum/admin/components/Modal' 导入
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
import ColorPreviewInput from 'flarum/common/components/ColorPreviewInput';
import app from 'flarum/admin/app'; // 确保导入 admin app

export default class EditTagModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);
    this.tag = this.attrs.tag || app.store.createRecord('dependency-tags');

    this.name = Stream(this.tag.name() || '');
    this.slug = Stream(this.tag.slug() || '');
    this.description = Stream(this.tag.description() || '');
    this.color = Stream(this.tag.color() || '#cccccc'); // Default color
    this.icon = Stream(this.tag.icon() || '');

    // 用于在提交失败时显示验证错误
    this.alertAttrs = null;
  }

  className() {
    return 'EditTagModal Modal--small';
  }

  title() {
    return this.tag.exists
      ? app.translator.trans('shebaoting-dependency-collector.admin.modal.edit_tag_title', { name: this.tag.name() })
      : app.translator.trans('shebaoting-dependency-collector.admin.modal.create_tag_title');
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group" key="name">
            <label>{app.translator.trans('shebaoting-dependency-collector.admin.modal.tag_name_label')}</label>
            <input className="FormControl" bidi={this.name} />
          </div>
          <div className="Form-group" key="slug">
            <label>{app.translator.trans('shebaoting-dependency-collector.admin.modal.tag_slug_label')}</label>
            <input className="FormControl" bidi={this.slug} />
          </div>
          <div className="Form-group" key="description">
            <label>{app.translator.trans('shebaoting-dependency-collector.admin.modal.tag_description_label')}</label>
            <textarea className="FormControl" bidi={this.description} rows="3"></textarea>
          </div>
          <div className="Form-group" key="color">
            <label>{app.translator.trans('shebaoting-dependency-collector.admin.modal.tag_color_label')}</label>
            <ColorPreviewInput className="FormControl" bidi={this.color} />
          </div>
          <div className="Form-group" key="icon">
            <label>{app.translator.trans('shebaoting-dependency-collector.admin.modal.tag_icon_label')}</label>
            <input className="FormControl" bidi={this.icon} placeholder="fas fa-code" />
            <small>
              {app.translator.trans('shebaoting-dependency-collector.admin.modal.tag_icon_help', {
                link: (
                  <a href="https://fontawesome.com/icons" tabindex="-1" target="_blank">
                    Font Awesome
                  </a>
                ),
              })}
            </small>
          </div>
          <div className="Form-group" key="submit">
            <Button type="submit" className="Button Button--primary" loading={this.loading}>
              {app.translator.trans('core.lib.save_button')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  onsubmit(e) {
    e.preventDefault();
    this.loading = true;
    this.alertAttrs = null; // 清除之前的错误提示

    // const isNew = !this.tag.exists; // 如果需要区分新建和编辑的特定逻辑

    this.tag
      .save({
        name: this.name(),
        slug: this.slug(),
        description: this.description(),
        color: this.color(),
        icon: this.icon(),
      })
      .then(() => {
        if (this.attrs.onsave) this.attrs.onsave(); // 调用父组件传递的回调，例如刷新列表
        this.hide(); // 关闭模态框
      })
      .catch((error) => {
        // Flarum 通常会将验证错误包装在 error.alert 中
        // 如果 error.alert 存在，ModalManager 会自动处理并显示它
        // 否则，你可能需要手动处理其他类型的错误
        if (error.alert) {
          this.alertAttrs = error.alert;
        } else {
          // 对于非标准错误，可以记录到控制台或显示一个通用错误
          console.error(error);
          // 也可以设置一个自定义的 alertAttrs
          // this.alertAttrs = { type: 'error', content: 'An unexpected error occurred.' };
        }
      })
      .finally(() => {
        this.loading = false;
        m.redraw(); // 确保UI更新
      });
  }
}
```

### 文件路径: `js\src\common\index.ts`

```typescript
import app from 'flarum/common/app';

app.initializers.add('shebaoting/dependency-collector', () => {
  console.log('[shebaoting/dependency-collector] Hello, forum and admin!');
});
```

### 文件路径: `js\src\common\models\DependencyItem.js`

```javascript
import Model from 'flarum/common/Model';
import mixin from 'flarum/common/utils/mixin'; // Not strictly needed for simple models but good to know
import { getPlainContent } from 'flarum/common/utils/string';

export default class DependencyItem extends Model {
  title = Model.attribute('title');
  link = Model.attribute('link');
  description = Model.attribute('description');
  status = Model.attribute('status');
  submittedAt = Model.attribute('submittedAt', Model.transformDate);
  approvedAt = Model.attribute('approvedAt', Model.transformDate);

  user = Model.hasOne('user');
  approver = Model.hasOne('approver');
  tags = Model.hasMany('tags'); // 'tags' here must match the relationship name in DependencyItemSerializer

  canEdit = Model.attribute('canEdit');
  canApprove = Model.attribute('canApprove');

  // Helper for description preview
  shortDescription(length = 100) {
    const desc = this.description();
    if (!desc) return '';
    // A more sophisticated truncation might be needed (e.g. strip HTML if description can contain it)
    return getPlainContent(desc).substring(0, length) + (desc.length > length ? '...' : '');
  }
}
```

### 文件路径: `js\src\common\models\DependencyTag.js`

```javascript
import Model from 'flarum/common/Model';

export default class DependencyTag extends Model {
  name = Model.attribute('name');
  slug = Model.attribute('slug');
  description = Model.attribute('description');
  color = Model.attribute('color');
  icon = Model.attribute('icon');
  createdAt = Model.attribute('createdAt', Model.transformDate);
  updatedAt = Model.attribute('updatedAt', Model.transformDate);
  itemCount = Model.attribute('itemCount');

  canEdit = Model.attribute('canEdit');
}
```

### 文件路径: `js\src\forum\index.ts`

```typescript
import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import LinkButton from 'flarum/common/components/LinkButton';

import DependencyItem from '../common/models/DependencyItem';
import DependencyTag from '../common/models/DependencyTag';
import DependencyListPage from './components/DependencyListPage';

// 确保 app 对象在全局可用 (Flarum 通常会处理这个)
// declare global {
//   const app: any;
// }

app.initializers.add('shebaoting/dependency-collector', () => {
  console.log('[shebaoting/dependency-collector] Initializing forum extension.');

  // 1. 注册前端模型
  // 'dependency-items' 必须与 DependencyItemSerializer.php 中定义的 $type 匹配
  app.store.models['dependency-items'] = DependencyItem;
  // 'dependency-tags' 必须与 DependencyTagSerializer.php 中定义的 $type 匹配
  app.store.models['dependency-tags'] = DependencyTag;

  // 2. 注册前端路由
  // 'dependency-collector.forum.index' 是你在后端 extend.php 中为前端路由定义的名称
  // '/dependencies' 是该路由的路径
  app.routes['dependency-collector.forum.index'] = {
    path: '/dependencies',
    component: DependencyListPage,
  };

  // 3. 在论坛侧边栏添加导航链接
  extend(IndexPage.prototype, 'navItems', (items) => {
    items.add(
      'dependency-collector', // 唯一的 key
      LinkButton.component(
        {
          href: app.route('dependency-collector.forum.index'),
          icon: 'fas fa-cubes',
        },
        app.translator.trans('shebaoting-dependency-collector.forum.nav_title')
      ),
      85 // 调整优先级
    );
  });
  // 4. (可选但推荐) 将后端权限暴露给前端
  // 这个值应该通过 ForumSerializer 在后端添加到 app.forum.attributes 中
  // 在 extend.php 中:
  // (new Extend\ApiSerializer(Flarum\Api\Serializer\ForumSerializer::class))
  //     ->attribute('canSubmitDependencyCollectorItem', function ($serializer) {
  //         return $serializer->getActor()->hasPermission('dependency-collector.submit');
  //     }),
  //
  // 如果你已经在后端这样做了，那么下面的代码就不再需要了，
  // 你可以直接在你的组件中使用 app.forum.attribute('canSubmitDependencyCollectorItem')
  //
  // 为了演示，如果你想强制前端知道这个属性（即使后端没发送），可以这样做，但不推荐用于实际权限检查：
  // if (app.forum) { // 确保 app.forum 对象存在
  //   app.forum.data.attributes.canSubmitDependencyCollectorItem = true; // 示例：假设所有用户都能提交
  // }
  // 正确的做法是依赖后端通过 ForumSerializer 发送的 'canSubmitDependencyCollectorItem' 属性。
  // 在你的组件中，你应该检查 app.forum.attribute('canSubmitDependencyCollectorItem')
});
```

### 文件路径: `js\src\forum\components\DependencyItemCard.js`

```javascript
import Component from 'flarum/common/Component';
import Link from 'flarum/common/components/Link';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import humanTime from 'flarum/common/utils/humanTime';
import classList from 'flarum/common/utils/classList';

export default class DependencyItemCard extends Component {
  view() {
    const item = this.attrs.item;
    const user = item.user();
    // const approver = item.approver(); // If you want to show approver

    return (
      <div className={classList('DependencyItemCard', item.status() === 'pending' && 'DependencyItemCard--pending')}>
        {item.status() === 'pending' && (
          <span className="DependencyItemCard-statusBadge">
            {app.translator.trans('shebaoting-dependency-collector.forum.item.pending_approval')}
          </span>
        )}
        <div className="DependencyItemCard-header">
          <h3 className="DependencyItemCard-title">
            <a href={item.link()} target="_blank" rel="noopener noreferrer">
              {item.title()}
            </a>
          </h3>
        </div>
        <div className="DependencyItemCard-body">
          <p className="DependencyItemCard-description">{item.shortDescription(150)}</p>
        </div>
        <div className="DependencyItemCard-footer">
          <div className="DependencyItemCard-tags">
            {item.tags() &&
              item.tags().map((tag) => (
                <Link
                  className="DependencyItemCard-tag"
                  href={app.route('dependency-collector.forum.index', { filter: { tag: tag.slug() } })}
                  style={{ backgroundColor: tag.color(), color: 'white' /* Adjust based on color contrast */ }}
                >
                  {tag.icon() && <i className={tag.icon() + ' DependencyItemCard-tagIcon'}></i>}
                  {tag.name()}
                </Link>
              ))}
          </div>
          <div className="DependencyItemCard-meta">
            {user && (
              <span className="DependencyItemCard-submitter">
                {avatar(user, { className: 'DependencyItemCard-avatar' })}
                {username(user)}
              </span>
            )}
            <span className="DependencyItemCard-time" title={item.submittedAt().toLocaleString()}>
              {humanTime(item.submittedAt())}
            </span>
            {/* Optional: Show approved at/by */}
          </div>
        </div>
      </div>
    );
  }
}
```

### 文件路径: `js\src\forum\components\DependencyListPage.js`

```javascript
import Page from 'flarum/common/components/Page';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import DependencyItemCard from './DependencyItemCard';
import listItems from 'flarum/common/helpers/listItems';
import Link from 'flarum/common/components/Link'; // For tag links
import SubmitDependencyModal from './SubmitDependencyModal'; // We'll create this

export default class DependencyListPage extends Page {
  oninit(vnode) {
    super.oninit(vnode);
    this.loading = true;
    this.items = [];
    this.tags = []; // To store available plugin tags for filtering
    this.moreResults = false;
    this.currentTagFilter = m.route.param('filter') && m.route.param('filter').tag; // Get tag from route

    this.loadResults();
    this.loadTags(); // For filter sidebar
  }

  view() {
    return (
      <div className="DependencyListPage">
        <div className="DependencyListPage-header">
          {/* Optional: Add sorting dropdown here */}
          {app.session.user &&
            app.forum.attribute('canSubmitDependencyCollectorItem') && ( // Check permission
              <Button
                className="Button Button--primary App-primaryControl"
                onclick={() => app.modal.show(SubmitDependencyModal, { onsubmit: this.loadResults.bind(this) })}
              >
                {app.translator.trans('shebaoting-dependency-collector.forum.list.submit_button')}
              </Button>
            )}
        </div>
        <div className="DependencyListPage-body">
          <div className="DependencyListPage-sidebar">
            <h3>{app.translator.trans('shebaoting-dependency-collector.forum.list.filter_by_tag')}</h3>
            <ul className="DependencyListTags">
              <li className={!this.currentTagFilter ? 'active' : ''}>
                <Link href={app.route('dependency-collector.forum.index')}>
                  {app.translator.trans('shebaoting-dependency-collector.forum.list.all_tags')}
                </Link>
              </li>
              {this.tags.map((tag) => (
                <li key={tag.id()} className={this.currentTagFilter === tag.slug() ? 'active' : ''}>
                  <Link href={app.route('dependency-collector.forum.index', { filter: { tag: tag.slug() } })}>
                    {tag.icon() && <i className={tag.icon() + ' DependencyListTag-icon'}></i>}
                    {tag.name()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="DependencyListPage-content">
            {this.loading && this.items.length === 0 ? (
              <LoadingIndicator />
            ) : (
              <div className="DependencyList">
                {this.items.map((item) => (
                  <DependencyItemCard item={item} key={item.id()} />
                ))}
              </div>
            )}

            {!this.loading && this.items.length === 0 && <p>{app.translator.trans('shebaoting-dependency-collector.forum.list.empty_text')}</p>}

            {this.moreResults && !this.loading && (
              <Button className="Button" onclick={this.loadMore.bind(this)}>
                {app.translator.trans('core.forum.discussion_list.load_more_button')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  loadResults(offset = 0) {
    this.loading = true;
    m.redraw(); // Inform Mithril about the change

    const params = {
      page: { offset },
      sort: '-approvedAt', // Default sort
      // include: 'user,tags,approver' // Already default in controller
    };

    if (this.currentTagFilter) {
      params.filter = { tag: this.currentTagFilter };
    }

    return app.store
      .find('dependency-items', params)
      .then((results) => {
        if (offset === 0) {
          this.items = [];
        }
        this.items.push(...results);
        this.moreResults = !!results.payload.links && !!results.payload.links.next;
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      })
      .finally(() => {
        this.loading = false;
        m.redraw();
      });
  }

  loadTags() {
    app.store.find('dependency-tags').then((tags) => {
      this.tags = tags;
      m.redraw();
    });
  }

  loadMore() {
    this.loadResults(this.items.length);
  }

  onremove(vnode) {
    super.onremove(vnode);
    // Clean up listeners or other resources if any
  }
}
```

### 文件路径: `js\src\forum\components\SubmitDependencyModal.js`

```javascript
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
// Select 组件不再需要
// import Select from 'flarum/common/components/Select';
import classList from 'flarum/common/utils/classList'; // 用于动态添加 CSS 类

export default class SubmitDependencyModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.title = Stream('');
    this.link = Stream('');
    this.description = Stream('');
    this.selectedTagIds = Stream([]); // 仍然存储选中标签的 ID 数组

    this.availableTagsList = []; // 修改：存储标签对象的数组
    this.loadingTags = true;

    app.store
      .find('dependency-tags')
      .then((tags) => {
        // 修改：直接存储标签对象数组
        this.availableTagsList = Array.isArray(tags) ? tags : [];
        this.loadingTags = false;
        m.redraw();
      })
      .catch((error) => {
        console.error('Error loading tags for submit modal:', error);
        this.loadingTags = false;
        m.redraw();
      });
  }

  className() {
    return 'SubmitDependencyModal Modal--small';
  }

  title() {
    return app.translator.trans('shebaoting-dependency-collector.forum.modal.submit_title');
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form Form--centered">
          <div className="Form-group">
            <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.title_label')}</label>
            <input
              className="FormControl"
              bidi={this.title}
              placeholder={app.translator.trans('shebaoting-dependency-collector.forum.modal.title_placeholder')}
            />
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.link_label')}</label>
            <input type="url" className="FormControl" bidi={this.link} placeholder="https://example.com" />
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.description_label')}</label>
            <textarea
              className="FormControl"
              bidi={this.description}
              rows="5"
              placeholder={app.translator.trans('shebaoting-dependency-collector.forum.modal.description_placeholder')}
            ></textarea>
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.tags_label')}</label>
            {this.loadingTags ? (
              <p>{app.translator.trans('core.lib.loading_indicator_text')}</p>
            ) : (
              // --- 修改开始: 渲染平铺的标签 ---
              <div className="TagSelector">
                {this.availableTagsList.length > 0 ? (
                  this.availableTagsList.map((tag) => {
                    const isSelected = this.selectedTagIds().includes(tag.id());
                    return (
                      <Button
                        className={classList('Button Button--tag', isSelected && 'active')}
                        icon={tag.icon()}
                        style={
                          isSelected
                            ? { backgroundColor: tag.color() || '#4D698E', color: 'white' }
                            : { borderColor: tag.color() || '#ddd', color: tag.color() || 'inherit' }
                        }
                        onclick={() => this.toggleTag(tag.id())}
                      >
                        {tag.name()}
                      </Button>
                    );
                  })
                ) : (
                  <p>{app.translator.trans('shebaoting-dependency-collector.forum.modal.no_tags_available')}</p> // 新增一个翻译条目
                )}
              </div>
              // --- 修改结束 ---
            )}
            <small>{app.translator.trans('shebaoting-dependency-collector.forum.modal.tags_help')}</small>
          </div>
          <div className="Form-group">
            <Button type="submit" className="Button Button--primary Button--block" loading={this.loading} disabled={!this.isValid()}>
              {app.translator.trans('shebaoting-dependency-collector.forum.modal.submit_button')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- 新增方法：切换标签选中状态 ---
  toggleTag(tagId) {
    const currentSelected = [...this.selectedTagIds()]; // 创建副本以避免直接修改 Stream 的内部数组
    const index = currentSelected.indexOf(tagId);

    if (index > -1) {
      currentSelected.splice(index, 1); // 如果已选中，则移除
    } else {
      currentSelected.push(tagId); // 如果未选中，则添加
    }
    this.selectedTagIds(currentSelected);
  }
  // --- 新增方法结束 ---

  isValid() {
    const selectedTags = this.selectedTagIds();
    return this.title() && this.link() && this.description() && Array.isArray(selectedTags) && selectedTags.length > 0;
  }

  onsubmit(e) {
    e.preventDefault();
    this.loading = true;

    const currentSelectedTagIds = this.selectedTagIds() || [];

    if (!Array.isArray(currentSelectedTagIds)) {
      console.error('SubmitDependencyModal onsubmit: currentSelectedTagIds is NOT an array before map. Halting submission logic.');
      this.loading = false;
      m.redraw();
      return;
    }

    const relationships = {
      tags: currentSelectedTagIds
        .map((id) => {
          const tag = app.store.getById('dependency-tags', id);
          if (!tag) {
            console.warn(`Tag with ID ${id} not found in store.`);
          }
          return tag;
        })
        .filter((tag) => tag),
    };

    app.store
      .createRecord('dependency-items')
      .save({
        title: this.title(),
        link: this.link(),
        description: this.description(),
        relationships: relationships,
      })
      .then(() => {
        if (this.attrs.onsubmit) this.attrs.onsubmit();
        this.hide();
      })
      .catch((error) => {
        console.error('Error submitting dependency:', error);
        this.alertAttrs = error.alert;
      })
      .finally(() => {
        this.loading = false;
        m.redraw();
      });
  }
}
```

### 文件路径: `less\admin.less`

```text
.DependencyCollectorSettingsPage {
    .container > section {
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
        &:last-child {
            border-bottom: none;
        }
    }
    .DependencyTable, .PluginTagsTable {
        th, td {
            vertical-align: middle;
        }
        small {
            display: block;
            color: #777;
            font-size: 0.9em;
        }
        .Button--icon {
            margin-right: 5px;
        }
    }
}

.EditTagModal {
    // Styles if needed
}
```

### 文件路径: `less\forum.less`

```text
.DependencyListPage {
    .DependencyListPage-body {
        display: flex;
    }
    .DependencyListPage-sidebar {
        width: 200px; // Adjust as needed
        margin-right: 20px;
        h3 {
            font-size: 1.1em;
            margin-bottom: 10px;
        }
        .DependencyListTags {
            list-style: none;
            padding-left: 0;
            li {
                margin-bottom: 5px;
                &.active a {
                    font-weight: bold;
                    color: @primary-color;
                }
                a {
                    text-decoration: none;
                    color: @text-color;
                    &:hover {
                        color: @primary-color;
                    }
                }
            }
            .DependencyListTag-icon {
                margin-right: 5px;
            }
        }
    }
    .DependencyListPage-content {
        flex-grow: 1;
    }
    .DependencyList {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); // Responsive grid
        gap: 15px;
    }
}

.DependencyItemCard {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 15px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &--pending {
        opacity: 0.7;
        border-left: 3px solid @alert-color;; // Example for pending
    }

    .DependencyItemCard-statusBadge {
        background-color: @alert-color;;
        color: white;
        padding: 2px 6px;
        font-size: 0.8em;
        border-radius: 3px;
        float: right; // Or position as needed
        margin-bottom: 5px;
    }

    .DependencyItemCard-header {
        margin-bottom: 10px;
        .DependencyItemCard-title a {
            font-size: 1.2em;
            font-weight: bold;
            color: @heading-color;
            text-decoration: none;
            &:hover {
                text-decoration: underline;
            }
        }
    }
    .DependencyItemCard-body {
        margin-bottom: 10px;
        flex-grow: 1;
        .DependencyItemCard-description {
            font-size: 0.9em;
            color: @text-color;
            line-height: 1.4;
        }
    }
    .DependencyItemCard-footer {
        font-size: 0.85em;
        color: #777;
        .DependencyItemCard-tags {
            margin-bottom: 8px;
            .DependencyItemCard-tag {
                display: inline-block;
                padding: 3px 8px;
                margin-right: 5px;
                margin-bottom: 5px;
                border-radius: 3px;
                font-size: 0.9em;
                text-decoration: none;
                &:hover {
                    opacity: 0.8;
                }
            }
            .DependencyItemCard-tagIcon {
                margin-right: 3px;
            }
        }
        .DependencyItemCard-meta {
            display: flex;
            align-items: center;
            .DependencyItemCard-submitter {
                display: flex;
                align-items: center;
                margin-right: 10px;
                .DependencyItemCard-avatar {
                    width: 20px;
                    height: 20px;
                    margin-right: 5px;
                }
            }
        }
    }
}

.SubmitDependencyModal {
    .TagSelector {
        display: flex;
        flex-wrap: wrap; // 允许标签换行
        gap: 8px; // 标签之间的间距

        .Button--tag {
            // 默认样式 (未选中)
            border: 1px solid #ddd; // 默认边框颜色
            background-color: transparent;
            color: #555; // 默认文字颜色
            padding: 5px 10px;
            font-size: 0.9em;
            transition: background-color 0.2s, color 0.2s, border-color 0.2s; // 平滑过渡

            &:hover {
                background-color: #f5f5f5;
                border-color: #ccc;
            }

            &.active {
                // 选中时的样式 - 优先使用标签自定义颜色
                // JS中通过 style 属性设置了 backgroundColor 和 color
                border-color: transparent; // 选中时可以隐藏边框或使用背景色作为边框
                font-weight: bold;

                // 如果标签没有自定义颜色，这里的样式会被 JS 中的 style 覆盖
                // 但可以作为备用或调整其他属性
                // background-color: @primary-color;
                // color: white;
            }

            .Button-icon {
                margin-right: 5px;
            }
        }
    }
}
```

### 文件路径: `locale\en.yml`

```yaml
shebaoting-dependency-collector:
  forum:
    nav_title: Dependencies
    list:
      submit_button: Submit Dependency
      filter_by_tag: Filter by Tag
      all_tags: All
      empty_text: No dependencies found.
    item:
      pending_approval: Pending Approval
    modal:
      submit_title: Submit New Dependency
      title_label: Title
      title_placeholder: e.g., Awesome Library
      link_label: Link
      description_label: Description
      description_placeholder: A short summary of what this dependency does.
      tags_label: Plugin Tags
      tags_help: Select at least one relevant tag.
      submit_button: Submit
  admin:
    nav:
      title: Dependency Collector
      description: Manage submitted dependencies and plugin tags.
    page:
      pending_items_title: Pending Dependencies for Review
      no_pending_items: There are no dependencies awaiting review.
      approved_items_title: Approved Dependencies
      no_approved_items: There are no approved dependencies yet.
      manage_tags_title: Manage Plugin Tags
      no_plugin_tags: No plugin tags have been created yet.
    table:
      title: Title
      submitted_by: Submitted By
      submitted_at: Submitted At
      approved_by: Approved By
      approved_at: Approved At
      tags: Tags
      tag_name: Name
      tag_slug: Slug
      tag_color_icon: Color & Icon
      tag_item_count: Items
      actions: Actions
    actions:
      create_tag: Create Tag
      approve: Approve
      reject: Reject
    confirm:
      approve: Approve dependency
      reject: Reject dependency
      delete: Delete dependency
      delete_tag: Delete tag "{name}"? This will remove it from all associated dependencies.
    modal:
      edit_tag_title: Edit Tag - {name}
      create_tag_title: Create New Tag
      tag_name_label: Name
      tag_slug_label: Slug
      tag_description_label: Description (Optional)
      tag_color_label: Color (e.g., #FF0000)
      tag_icon_label: Icon (e.g., fas fa-code)
      tag_icon_help: Find icons on <a>Font Awesome</a>.
    permissions:
      submit_label: Submit dependencies
      moderate_label: Moderate dependencies (approve, reject, edit, delete)
      manage_tags_label: Manage plugin tags
```

### 文件路径: `locale\zh.yml`

```yaml
shebaoting-dependency-collector:
  forum:
    nav_title: 依赖项中心 # 论坛导航栏链接文本
    list:
      submit_button: 提交依赖项 # 依赖项列表页的“提交”按钮
      filter_by_tag: 按标签筛选 # 筛选区域标题
      all_tags: 全部标签 # “全部标签”筛选选项
      empty_text: 暂无依赖项。 # 列表为空时的提示文本
    item:
      pending_approval: 审核中 # 依赖项卡片上“待审核”状态的徽章
    modal:
      submit_title: 提交新的依赖项 # 提交依赖项弹窗的标题
      title_label: 标题 # 标题输入框的标签
      title_placeholder: 例如：很棒的库 # 标题输入框的占位符
      link_label: 链接 # 链接输入框的标签
      link_placeholder: https://example.com # 链接输入框的占位符
      description_label: 简介 # 简介文本区域的标签
      description_placeholder: 关于此依赖项功能的简短描述。 # 简介文本区域的占位符
      tags_label: 插件标签 # 插件标签选择区域的标签
      tags_help: 请至少选择一个相关的标签 # 插件标签选择的帮助文本
      submit_button: 提交 # 弹窗中的提交按钮

  admin:
    nav:
      title: 依赖收集器 # 后台导航栏中插件的名称
      description: 管理已提交的依赖项和插件自定义标签。 # 后台插件页面的描述
    page:
      pending_items_title: 待审核的依赖项 # “待审核列表”区域的标题
      no_pending_items: 当前没有等待审核的依赖项。 # “待审核列表”为空时的提示
      approved_items_title: 已批准的依赖项 # “已批准列表”区域的标题
      no_approved_items: 目前还没有已批准的依赖项。 # “已批准列表”为空时的提示
      manage_tags_title: 管理插件标签 # “管理插件标签”区域的标题
      no_plugin_tags: 尚未创建任何插件标签。 # “插件标签列表”为空时的提示
    table:
      title: 标题
      submitted_by: 提交者
      submitted_at: 提交于
      approved_by: 审核者
      approved_at: 审核于
      tags: 标签
      tag_name: 标签名称
      tag_slug: 标签标识符 (Slug)
      tag_color_icon: 颜色与图标
      tag_item_count: 条目数
      actions: 操作
    actions:
      create_tag: 创建标签 # “创建标签”按钮文本
      approve: 批准 # “批准”按钮文本
      reject: 拒绝 # “拒绝”按钮文本
    confirm:
      approve: 确定要批准依赖项 # 批准确认提示
      reject: 确定要拒绝依赖项 # 拒绝确认提示
      delete: 确定要删除依赖项 # 删除依赖项确认提示
      delete_tag: 您确定要删除标签 "{name}" 吗？这将从所有关联的依赖项中移除此标签。 # 删除标签确认提示，{name} 是占位符
    modal:
      edit_tag_title: 编辑标签 - {name} # 编辑标签弹窗标题
      create_tag_title: 创建新标签 # 创建标签弹窗标题
      tag_name_label: 名称
      tag_slug_label: 标识符 (Slug)
      tag_description_label: 描述 (可选)
      tag_color_label: 颜色 (例如：#FF0000)
      tag_icon_label: 图标 (例如：fas fa-code)
      tag_icon_help: 在 <a>Font Awesome</a> 上查找图标。 # 图标帮助文本，<a> 是用于链接的特殊标记
    permissions: # 后台权限设置页面的权限描述
      submit_label: 提交依赖项
      moderate_label: 管理依赖项 (批准、拒绝、编辑、删除)
      manage_tags_label: 管理插件标签
```

### 文件路径: `migrations\2025_05_07_183040_create_dependency_collector_items_table.php`

```php
<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasTable('dependency_collector_items')) {
            $schema->create('dependency_collector_items', function (Blueprint $table) {
                $table->increments('id');
                $table->string('title');
                $table->string('link');
                $table->text('description');
                $table->unsignedInteger('user_id');
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
                $table->timestamp('submitted_at')->useCurrent();
                $table->timestamp('approved_at')->nullable();
                $table->unsignedInteger('approver_user_id')->nullable();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('approver_user_id')->references('id')->on('users')->onDelete('set null');
            });
        }
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('dependency_collector_items');
    },
];
```

### 文件路径: `migrations\2025_05_07_183115_create_dependency_collector_tags_table.php`

```php
<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasTable('dependency_collector_tags')) {
            $schema->create('dependency_collector_tags', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name')->unique();
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->string('color', 7)->nullable(); // e.g., #RRGGBB
                $table->string('icon')->nullable();    // e.g., fas fa-code
                $table->timestamps();
            });
        }
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('dependency_collector_tags');
    },
];
```

### 文件路径: `migrations\2025_05_07_183145_create_dependency_collector_item_tag_table.php`

```php
<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasTable('dependency_collector_item_tag')) {
            $schema->create('dependency_collector_item_tag', function (Blueprint $table) {
                $table->unsignedInteger('item_id');
                $table->unsignedInteger('tag_id');
                $table->primary(['item_id', 'tag_id']);

                $table->foreign('item_id')->references('id')->on('dependency_collector_items')->onDelete('cascade');
                $table->foreign('tag_id')->references('id')->on('dependency_collector_tags')->onDelete('cascade');
            });
        }
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('dependency_collector_item_tag');
    },
];
```

### 文件路径: `src\Access\DependencyItemPolicy.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Access;

use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;
use Shebaoting\DependencyCollector\Models\DependencyItem;

class DependencyItemPolicy extends AbstractPolicy
{
    public function edit(User $actor, DependencyItem $item)
    {
        if ($actor->hasPermission('dependency-collector.moderate')) {
            return $this->allow();
        }

        // Optional: Allow user to edit their own PENDING submission
        // if ($item->status === 'pending' && $actor->id === $item->user_id && $actor->hasPermission('dependency-collector.editOwnPending')) {
        //     return $this->allow();
        // }

        return $this->deny();
    }

    // Add other abilities like 'approve', 'reject', 'delete' if you want granular control
    // Otherwise, 'dependency-collector.moderate' can cover these in the controllers.
}
```

### 文件路径: `src\Api\Controller\CreateDependencyItemController.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyItemSerializer;
use Shebaoting\DependencyCollector\Api\Validators\DependencyItemValidator; // We'll create this

class CreateDependencyItemController extends AbstractCreateController
{
    public $serializer = DependencyItemSerializer::class;

    public $include = ['user', 'tags'];

    protected $validator;

    public function __construct(DependencyItemValidator $validator)
    {
        $this->validator = $validator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $data = Arr::get($request->getParsedBody(), 'data', []);

        $actor->assertCan('dependency-collector.submit');

        $attributes = Arr::get($data, 'attributes', []);
        $relationships = Arr::get($data, 'relationships', []);
        $tagIds = [];
        if (isset($relationships['tags']['data'])) {
            foreach ($relationships['tags']['data'] as $tagData) {
                if (isset($tagData['id'])) {
                    $tagIds[] = $tagData['id'];
                }
            }
        }
        if (empty($tagIds)) {
            // Or handle in validator: throw new ValidationException(['tags' => 'At least one tag is required.']);
        }


        $this->validator->assertValid(array_merge($attributes, ['tag_ids' => $tagIds]));


        $item = DependencyItem::build(
            Arr::get($attributes, 'title'),
            Arr::get($attributes, 'link'),
            Arr::get($attributes, 'description'),
            $actor->id
        );

        // Event for pre-save modifications if needed by other extensions
        // $this->events->dispatch(new Saving($item, $actor, $data));

        $item->save();

        if (!empty($tagIds)) {
            $item->tags()->sync($tagIds);
        }

        // Event for post-save actions
        // $this->events->dispatch(new Created($item, $actor, $data));

        return $item;
    }
}
```

### 文件路径: `src\Api\Controller\CreateDependencyTagController.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyTag;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyTagSerializer;
use Shebaoting\DependencyCollector\Api\Validators\DependencyTagValidator;
use Illuminate\Support\Str; // 用于生成 slug

class CreateDependencyTagController extends AbstractCreateController
{
    public $serializer = DependencyTagSerializer::class;

    protected $validator;

    public function __construct(DependencyTagValidator $validator)
    {
        $this->validator = $validator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $data = Arr::get($request->getParsedBody(), 'data', []);
        $attributes = Arr::get($data, 'attributes', []);

        // 权限检查
        $actor->assertCan('dependency-collector.manageTags');

        // 如果 slug 未提供，则根据 name 自动生成
        if (empty($attributes['slug']) && !empty($attributes['name'])) {
            $attributes['slug'] = Str::slug($attributes['name']);
        }

        // 验证数据
        $this->validator->assertValid($attributes);

        $tag = DependencyTag::build(
            Arr::get($attributes, 'name'),
            Arr::get($attributes, 'slug'),
            Arr::get($attributes, 'description'),
            Arr::get($attributes, 'color'),
            Arr::get($attributes, 'icon')
        );

        // 如果有其他需要在保存前处理的逻辑，可以在这里添加
        // 例如，触发事件：$this->events->dispatch(new Events\TagWillBeCreated($tag, $actor, $data));

        $tag->save();

        // 例如，触发事件：$this->events->dispatch(new Events\TagWasCreated($tag, $actor, $data));

        return $tag;
    }
}
```

### 文件路径: `src\Api\Controller\DeleteDependencyItemController.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Shebaoting\DependencyCollector\Models\DependencyItem;

class DeleteDependencyItemController extends AbstractDeleteController
{
    protected function delete(ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);
        $itemId = Arr::get($request->getQueryParams(), 'id');

        $actor->assertCan('dependency-collector.moderate'); // Or a more specific delete permission

        $item = DependencyItem::findOrFail($itemId);
        $item->delete();
    }
}
```

### 文件路径: `src\Api\Controller\DeleteDependencyTagController.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Shebaoting\DependencyCollector\Models\DependencyTag;

class DeleteDependencyTagController extends AbstractDeleteController
{
    protected function delete(ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);
        $tagId = Arr::get($request->getQueryParams(), 'id');

        // 权限检查
        $actor->assertCan('dependency-collector.manageTags');

        $tag = DependencyTag::findOrFail($tagId);

        // 在删除标签之前，解除它与所有依赖项的关联
        // 这样做是为了避免因外键约束而出错，并且是“软”删除关联关系
        // 如果直接删除标签，并且 `dependency_collector_item_tag` 表中设置了 onDelete('cascade')，
        // 那么关联记录会自动删除。这里我们明确解除关联。
        $tag->items()->detach(); // 解除所有关联的依赖项

        // 如果有其他需要在删除前处理的逻辑，可以在这里添加
        // 例如，触发事件：$this->events->dispatch(new Events\TagWillBeDeleted($tag, $actor));

        $tag->delete();

        // 例如，触发事件：$this->events->dispatch(new Events\TagWasDeleted($tag, $actor));
    }
}
```

### 文件路径: `src\Api\Controller\ListDependencyItemsController.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Flarum\Http\UrlGenerator;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyItemSerializer;
use Illuminate\Support\Arr;
use Illuminate\Support\Str; // 用于驼峰转蛇形

class ListDependencyItemsController extends AbstractListController
{
    /**
     * {@inheritdoc}
     * 指定用于此控制器的序列化器。
     */
    public $serializer = DependencyItemSerializer::class;

    /**
     * {@inheritdoc}
     * 默认情况下要包含的关联关系。
     * 例如：['user', 'tags', 'approver']
     */
    public $include = ['user', 'tags', 'approver'];

    /**
     * {@inheritdoc}
     * 允许客户端进行排序的字段列表。
     * 这些字段名应该是前端API请求中使用的驼峰式名称。
     */
    public $sortFields = ['submittedAt', 'approvedAt'];

    /**
     * {@inheritdoc}
     * 默认的排序规则。
     * 键名应该是前端API请求中使用的驼峰式名称。
     * 值可以是 'asc' 或 'desc'。
     * 或者，可以使用 Flarum 的约定，例如 '-approvedAt' 表示按 approvedAt 降序。
     * extractSort 方法会处理前缀 '-'。
     */
    public $sort = ['approvedAt' => 'desc']; // 默认按批准时间降序

    /**
     * @var UrlGenerator
     */
    protected $url;

    /**
     * @param UrlGenerator $url
     */
    public function __construct(UrlGenerator $url)
    {
        $this->url = $url;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request); // 获取当前操作的用户
        $filters = $this->extractFilter($request); // 提取请求中的过滤参数

        // 从请求中提取排序参数 (例如 ?sort=approvedAt 或 ?sort=-submittedAt)
        // extractSort 会根据 $this->sortFields 验证这些参数
        // 返回值是一个关联数组，键是前端使用的字段名 (如 'approvedAt')，值是排序方向 ('asc' 或 'desc')
        $sortInput = $this->extractSort($request);

        // 如果请求中没有提供排序参数，则使用控制器定义的默认排序
        if (empty($sortInput)) {
            $sortInput = $this->sort;
        }

        // 将前端使用的排序字段名 (驼峰式) 转换为数据库实际使用的列名 (蛇形)
        $dbSort = [];
        foreach ($sortInput as $frontendField => $direction) {
            // 确保只转换在 $this->sortFields 中定义的、允许排序的字段
            if (in_array($frontendField, $this->sortFields)) {
                $dbSort[Str::snake($frontendField)] = $direction;
            }
        }

        $limit = $this->extractLimit($request); // 提取分页大小限制
        $offset = $this->extractOffset($request); // 提取分页偏移量
        $include = $this->extractInclude($request); // 提取请求中明确要求包含的关联关系

        // 初始化查询构造器
        $query = DependencyItem::query();

        // 根据用户权限和状态进行过滤
        if (!$actor->hasPermission('dependency-collector.moderate')) {
            // 普通用户只能看到已批准的依赖项，或者他们自己提交的待审核依赖项
            $query->where(function ($q) use ($actor) {
                $q->where('status', 'approved')
                    ->orWhere(function ($q2) use ($actor) {
                        $q2->where('user_id', $actor->id)
                            ->where('status', 'pending');
                    });
            });
        } else {
            // 管理员/版主可以看到所有状态的依赖项，除非有明确的状态过滤
            $statusFilter = Arr::get($filters, 'status');
            if ($statusFilter && in_array($statusFilter, ['pending', 'approved', 'rejected'])) {
                $query->where('status', $statusFilter);
            }
        }

        // 根据插件标签 (slug) 进行过滤
        $tagFilterSlug = Arr::get($filters, 'tag'); // 假设前端通过 ?filter[tag]=tag-slug 的方式传递
        if ($tagFilterSlug) {
            $query->whereHas('tags', function ($q) use ($tagFilterSlug) {
                // 假设 DependencyTag 模型中 'slug' 列存储了标签的 slug
                $q->where('dependency_collector_tags.slug', $tagFilterSlug);
            });
        }

        // 获取过滤和权限控制后的总结果数，用于分页
        $totalResults = $query->count();

        // 应用分页
        $query->skip($offset)->take($limit);

        // 应用排序 (使用转换后的数据库列名)
        foreach ($dbSort as $dbField => $order) {
            $query->orderBy($dbField, $order);
        }

        // 为响应文档添加分页链接
        $document->addPaginationLinks(
            $this->url->to('api')->route('dependency-collector.items.index'), // 当前列表 API 路由的 URL
            $request->getQueryParams(), // 当前请求的查询参数，用于构建分页链接
            $offset,
            $limit,
            $totalResults - ($offset + $limit) > 0 ? null : 0 // 如果还有更多结果，则 $remaining 不为0
        );

        // 执行查询并获取结果集合
        $results = $query->get();

        // 加载请求中指定的关联关系 (例如 'user', 'tags')
        // $this->loadRelations 会处理 $include 参数，并高效加载数据
        $this->loadRelations($results, $include, $request);

        return $results; // 返回结果给序列化器进行处理
    }
}
```

### 文件路径: `src\Api\Controller\ListDependencyTagsController.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Flarum\Http\UrlGenerator;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyTag;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyTagSerializer;
use Illuminate\Support\Arr;

class ListDependencyTagsController extends AbstractListController
{
    // 指定序列化器
    public $serializer = DependencyTagSerializer::class;

    // 可选的默认包含的关联关系
    // public $include = [];

    // 可选的排序字段
    public $sortFields = ['name', 'createdAt', 'itemCount']; // itemCount 需要在 serializer 中计算或通过 withCount 加载

    // 默认排序
    public $sort = ['name' => 'asc'];

    protected $url;

    public function __construct(UrlGenerator $url)
    {
        $this->url = $url;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);

        // 任何人都可以查看标签列表，因此通常不需要特定的权限检查来列出它们
        // 如果有需要，可以在这里添加，例如： $actor->assertCan('viewDependencyTags');

        $filters = $this->extractFilter($request);
        $sort = $this->extractSort($request);

        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);
        // $include = $this->extractInclude($request); // 如果有 $include 定义

        $query = DependencyTag::query();

        // 可以在此处添加基于 $filters 的查询逻辑，例如按名称搜索
        // $search = Arr::get($filters, 'q');
        // if ($search) {
        //     $query->where('name', 'like', "%{$search}%");
        // }

        // 如果需要显示 itemCount，确保它被正确加载或计算
        // 例如，如果 DependencyTagSerializer 中的 itemCount 是通过 items()->count() 计算的，
        // 并且你希望能够按它排序，你可能需要使用 withCount('items')
        if (isset($sort['itemCount'])) {
            $query->withCount('items'); // 这样就会有一个 items_count 列可供排序
            // 注意：如果 $sortFields 中定义了 'itemCount'，实际排序时应使用 'items_count'
            if ($sortKey = array_search('itemCount', $this->sortFields, true)) {
                // 更新排序键，以匹配 withCount 生成的列名
                if (isset($sort['itemCount'])) {
                    $sort['items_count'] = $sort['itemCount'];
                    unset($sort['itemCount']);
                }
            }
        }


        $totalResults = $query->count();

        $query->skip($offset)->take($limit);

        foreach ((array) $sort as $field => $order) {
            // 确保对 itemCount 排序时使用正确的列名
            if ($field === 'itemCount' && $query->getQuery()->columns && in_array('items_count', array_column($query->getQuery()->columns, 'name'))) {
                $query->orderBy('items_count', $order);
            } elseif (in_array($field, $this->sortFields)) {
                $query->orderBy($field, $order);
            }
        }


        $document->addPaginationLinks(
            $this->url->to('api')->route('dependency-collector.tags.index'),
            $request->getQueryParams(),
            $offset,
            $limit,
            $totalResults - ($offset + $limit) > 0 ? null : 0
        );

        $results = $query->get();

        // $this->loadRelations($results, $include, $request); // 如果有 $include 定义

        return $results;
    }
}
```

### 文件路径: `src\Api\Controller\UpdateDependencyItemController.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractShowController; // Use Show as base for PATCH
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyItemSerializer;
use Shebaoting\DependencyCollector\Api\Validators\DependencyItemValidator;
use Carbon\Carbon;

class UpdateDependencyItemController extends AbstractShowController
{
    public $serializer = DependencyItemSerializer::class;

    public $include = ['user', 'tags', 'approver'];

    protected $validator;

    public function __construct(DependencyItemValidator $validator)
    {
        $this->validator = $validator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $itemId = Arr::get($request->getQueryParams(), 'id');
        $data = Arr::get($request->getParsedBody(), 'data', []);
        $attributes = Arr::get($data, 'attributes', []);

        $item = DependencyItem::findOrFail($itemId);

        // Check permissions
        if ($actor->id === $item->user_id && $item->status === 'pending' && $actor->can('editOwnPending', $item)) {
            // Allow user to edit their own pending submission (limited fields)
            // This is an optional feature, if implemented, create 'editOwnPending' permission
        } elseif ($actor->can('dependency-collector.moderate')) {
            // Admin/Moderator can edit more
        } else {
            $actor->assertPermission(false); // Deny access
        }

        $this->validator->assertValid(array_merge($attributes, ['is_update' => true]));

        if (isset($attributes['title'])) {
            $item->title = $attributes['title'];
        }
        if (isset($attributes['link'])) {
            $item->link = $attributes['link'];
        }
        if (isset($attributes['description'])) {
            $item->description = $attributes['description'];
        }

        // Admin/Moderator specific updates
        if ($actor->can('dependency-collector.moderate')) {
            if (isset($attributes['status']) && in_array($attributes['status'], ['approved', 'rejected', 'pending'])) {
                if ($item->status !== 'approved' && $attributes['status'] === 'approved') {
                    $item->approved_at = Carbon::now();
                    $item->approver_user_id = $actor->id;
                } elseif ($attributes['status'] !== 'approved') {
                    $item->approved_at = null;
                    $item->approver_user_id = null;
                }
                $item->status = $attributes['status'];
            }
        }

        // Handle tags update
        $relationships = Arr::get($data, 'relationships', []);
        if (isset($relationships['tags']['data'])) {
            $tagIds = [];
            foreach ($relationships['tags']['data'] as $tagData) {
                if (isset($tagData['id'])) {
                    $tagIds[] = $tagData['id'];
                }
            }
            // Ensure at least one tag if admin is editing
            if ($actor->can('dependency-collector.moderate') && empty($tagIds)) {
                // throw new ValidationException(['tags' => 'At least one tag is required for approved items.']);
            }
            $item->tags()->sync($tagIds);
        }


        $item->save();

        return $item;
    }
}
```

### 文件路径: `src\Api\Controller\UpdateDependencyTagController.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractShowController; // 基类通常用于获取单个资源，这里用于 PATCH
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyTag;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyTagSerializer;
use Shebaoting\DependencyCollector\Api\Validators\DependencyTagValidator;
use Illuminate\Support\Str; // 用于生成 slug

class UpdateDependencyTagController extends AbstractShowController
{
    public $serializer = DependencyTagSerializer::class;

    protected $validator;

    public function __construct(DependencyTagValidator $validator)
    {
        $this->validator = $validator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $tagId = Arr::get($request->getQueryParams(), 'id');
        $data = Arr::get($request->getParsedBody(), 'data', []);
        $attributes = Arr::get($data, 'attributes', []);

        // 权限检查
        $actor->assertCan('dependency-collector.manageTags');

        $tag = DependencyTag::findOrFail($tagId);

        // 如果 slug 未提供且 name 发生变化，则根据新的 name 自动重新生成 slug
        if (isset($attributes['name']) && $attributes['name'] !== $tag->name && empty($attributes['slug'])) {
            $attributes['slug'] = Str::slug($attributes['name']);
        }

        // 在验证之前，将模型ID传递给验证器，以便在 unique 规则中忽略当前模型
        // $this->validator->setRules(['id' => $tag->id]); // 这是一个示例，具体实现取决于验证器如何接收ID
        // 或者，你可以在 DependencyTagValidator 中修改 getRules 方法，从 attributes 中获取 id (如果前端传递了)
        // 或者，更标准的方式是，unique 规则通常会自动处理 ignore(this->model->id) 的情况，如果验证器与模型绑定。
        // Flarum 的 AbstractValidator 可能需要你显式处理 ignore。
        // 对于 unique:table,column,except,idColumn
        // 我们需要在 DependencyTagValidator 的 getRules 中处理 `ignore($tagIdToIgnore)`

        // 为了使 unique 验证忽略当前记录，我们需要在验证器中获取当前标签的 ID
        // 一种方法是在验证器构造函数中注入请求，或者像下面这样传递
        $validationAttributes = $attributes;
        if (!isset($validationAttributes['id'])) { // 确保ID在验证属性中，用于unique:ignore
            $validationAttributes['id'] = $tag->id;
        }
        $this->validator->assertValid($validationAttributes);


        if (isset($attributes['name'])) {
            $tag->name = $attributes['name'];
        }
        if (isset($attributes['slug'])) {
            $tag->slug = $attributes['slug'];
        }
        if (array_key_exists('description', $attributes)) { // array_key_exists 用于允许设置为空字符串或null
            $tag->description = $attributes['description'];
        }
        if (array_key_exists('color', $attributes)) {
            $tag->color = $attributes['color'];
        }
        if (array_key_exists('icon', $attributes)) {
            $tag->icon = $attributes['icon'];
        }

        // 如果有其他需要在保存前处理的逻辑，可以在这里添加
        // 例如，触发事件：$this->events->dispatch(new Events\TagWillBeUpdated($tag, $actor, $data));

        $tag->save();

        // 例如，触发事件：$this->events->dispatch(new Events\TagWasUpdated($tag, $actor, $data));

        return $tag;
    }
}
```

### 文件路径: `src\Api\Serializer\DependencyItemSerializer.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Tobscure\JsonApi\Relationship;
use Tobscure\JsonApi\Resource as JsonApiResource;


class DependencyItemSerializer extends AbstractSerializer
{
    protected $type = 'dependency-items';

    /**
     * @param DependencyItem $item
     */
    protected function getDefaultAttributes($item)
    {
        $attributes = [
            'title'        => $item->title,
            'link'         => $item->link,
            'description'  => $item->description,
            'status'       => $item->status,
            'submittedAt'  => $this->formatDate($item->submitted_at),
            'approvedAt'   => $this->formatDate($item->approved_at),
            'canEdit'      => $this->actor->can('edit', $item),
            'canApprove'   => $this->actor->can('dependency-collector.moderate'),
            // Add more attributes as needed
        ];

        if ($this->actor->can('dependency-collector.moderate') || ($this->actor->id === $item->user_id && $item->status === 'pending')) {
            // Expose more details if user can moderate or is the owner of a pending item
        }


        return $attributes;
    }

    protected function user($item): ?Relationship
    {
        return $this->hasOne($item, BasicUserSerializer::class);
    }

    protected function approver($item): ?Relationship
    {
        return $this->hasOne($item, BasicUserSerializer::class);
    }

    protected function tags($item): Relationship
    {
        return $this->hasMany($item, DependencyTagSerializer::class);
    }
}
```

### 文件路径: `src\Api\Serializer\DependencyTagSerializer.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Shebaoting\DependencyCollector\Models\DependencyTag;

class DependencyTagSerializer extends AbstractSerializer
{
    protected $type = 'dependency-tags';

    /**
     * @param DependencyTag $tag
     */
    protected function getDefaultAttributes($tag)
    {
        return [
            'name'          => $tag->name,
            'slug'          => $tag->slug,
            'description'   => $tag->description,
            'color'         => $tag->color,
            'icon'          => $tag->icon,
            'createdAt'     => $this->formatDate($tag->created_at),
            'updatedAt'     => $this->formatDate($tag->updated_at),
            'itemCount'     => (int) $tag->items()->count(), // Optional: count of items with this tag
            'canEdit'       => $this->actor->can('dependency-collector.manageTags'),
        ];
    }
}
```

### 文件路径: `src\Api\Validators\DependencyItemValidator.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Validators;

use Flarum\Foundation\AbstractValidator;
use Illuminate\Validation\Rule;
use Shebaoting\DependencyCollector\Models\DependencyTag;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Illuminate\Support\Arr; // Arr::get 可能仍然有用，但不是针对 $this->attributes

class DependencyItemValidator extends AbstractValidator
{
    /**
     * @var DependencyItem|null
     */
    protected $item;

    /**
     * @param DependencyItem $item
     */
    public function setItem(DependencyItem $item)
    {
        $this->item = $item;
    }

    protected function getRules()
    {
        // 判断是更新还是创建，基于 $this->item 是否已设置且存在
        $isUpdate = ($this->item && $this->item->exists);

        $rules = [
            'title' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:255'],
            'link' => [$isUpdate ? 'sometimes' : 'required', 'url', 'max:255'],
            'description' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:5000'],
            // 'tag_ids' 规则:
            // - 'sometimes': 表示只有当 tag_ids 字段在输入数据中存在时，后续规则才会应用。
            // - 'array': 值必须是数组。
            // - 对于创建 ($isUpdate 为 false):
            //    - 'required': tag_ids 字段必须存在。 (如果前端总是提交空数组，可以考虑去掉，依赖 min:1)
            //    - 'min:1': 数组至少要有一个元素。
            // - 对于更新 ($isUpdate 为 true):
            //    - 'nullable': 允许 tag_ids 为 null (或者前端可以不提交该字段，由 sometimes 控制)。
            //      如果前端提交空数组 []，它会被 'array' 规则接受，并且因为没有 'min:1'，所以是有效的（表示移除所有标签）。
            'tag_ids' => [
                'sometimes',
                'array',
                $isUpdate ? 'nullable' : 'required', // 创建时必须，更新时可空
            ],
            'tag_ids.*' => [
                'integer',
                Rule::exists((new DependencyTag)->getTable(), 'id')
            ],
            'status' => [
                'sometimes',
                Rule::in(['pending', 'approved', 'rejected'])
            ]
        ];

        if (!$isUpdate) {
            // 确保创建时 tag_ids 至少有一个元素
            // 如果 'tag_ids' => ['required', 'array', 'min:1'] 这样写更简洁
            // 这里我们附加 min:1 到已有的 'sometimes', 'array', 'required' 规则上
            // 需要确保 'tag_ids' 键本身是存在的，'required' 确保了这一点。
            $rules['tag_ids'][] = 'min:1';
        }


        return $rules;
    }

    protected function getMessages()
    {
        return [
            'tag_ids.required' => 'At least one plugin tag is required.',
            'tag_ids.min' => 'At least one plugin tag is required.',
            'tag_ids.*.exists' => 'One or more selected plugin tags are invalid.'
        ];
    }
}
```

### 文件路径: `src\Api\Validators\DependencyTagValidator.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Validators;

use Flarum\Foundation\AbstractValidator;
use Illuminate\Validation\Rule;
use Shebaoting\DependencyCollector\Models\DependencyTag;
use Illuminate\Support\Arr;


class DependencyTagValidator extends AbstractValidator
{
    // 移除 $model 属性声明，因为 AbstractValidator 没有定义它
    // protected $model; // 移除或注释掉这行

    // 使用一个内部属性来存储可能存在的模型实例（主要用于更新）
    protected $tagInstance = null;

    /**
     * 可选方法：允许控制器设置正在更新的模型实例
     * @param DependencyTag|null $tag
     */
    public function setInstance(?DependencyTag $tag)
    {
        $this->tagInstance = $tag;
    }

    protected function getRules()
    {
        // 确定在 unique 检查时要忽略的 ID
        $tagIdToIgnore = null;
        if ($this->tagInstance && $this->tagInstance->exists) {
            // 如果我们设置了实例（通常在更新时），则使用其实例 ID
            $tagIdToIgnore = $this->tagInstance->id;
        }
        // 注意：对于创建操作，$tagIdToIgnore 将保持为 null，这是正确的

        return [
            'name' => [
                'required',
                'string',
                'max:100',
                // 使用 Rule::unique 来构建唯一性规则，并指定要忽略的 ID
                Rule::unique((new DependencyTag)->getTable(), 'name')->ignore($tagIdToIgnore)
            ],
            'slug' => [
                'required',
                'string',
                'max:100',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique((new DependencyTag)->getTable(), 'slug')->ignore($tagIdToIgnore)
            ],
            'description' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:7', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'icon' => ['nullable', 'string', 'max:100'],
        ];
    }
}
```

### 文件路径: `src\Models\DependencyItem.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Models;

use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait;
use Flarum\User\User;
use Carbon\Carbon;

class DependencyItem extends AbstractModel
{
    use ScopeVisibilityTrait;

    protected $table = 'dependency_collector_items';

    protected $dates = ['submitted_at', 'approved_at'];

    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'approver_user_id' => 'integer',
    ];

    public static function build(string $title, string $link, string $description, int $userId)
    {
        $item = new static();
        $item->title = $title;
        $item->link = $link;
        $item->description = $description;
        $item->user_id = $userId;
        $item->status = 'pending'; // Default status
        $item->submitted_at = Carbon::now();

        return $item;
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_user_id');
    }

    public function tags()
    {
        return $this->belongsToMany(DependencyTag::class, 'dependency_collector_item_tag', 'item_id', 'tag_id');
    }
}
```

### 文件路径: `src\Models\DependencyTag.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Models;

use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait; // Might not be needed if tags are always public

class DependencyTag extends AbstractModel
{
    // use ScopeVisibilityTrait; // Consider if tags need visibility scoping

    protected $table = 'dependency_collector_tags';

    protected $dates = ['created_at', 'updated_at'];

    protected $fillable = ['name', 'slug', 'description', 'color', 'icon']; // For mass assignment

    public static function build(string $name, string $slug, ?string $description = null, ?string $color = null, ?string $icon = null)
    {
        $tag = new static();
        $tag->name = $name;
        $tag->slug = $slug;
        $tag->description = $description;
        $tag->color = $color;
        $tag->icon = $icon;

        return $tag;
    }

    public function items()
    {
        return $this->belongsToMany(DependencyItem::class, 'dependency_collector_item_tag', 'tag_id', 'item_id');
    }
}
```

