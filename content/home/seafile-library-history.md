+++
title = "Seafile library history"
date = 2016-11-19
tags = ["seafile"]
draft = false
+++

[Seafile](<https://www.seafile.com/en/home/>) has a really neat 'history' browser - on the web site you will see a little clock icon when viewing a library. If you click this you can navigate to a point-in-time and then either restore the entire library, a folder or a file from that snapshot.

For example, from the list of libraries:

{{<figure src="/img/seafile-history/library-list.png">}}

pick a library:

{{<figure src="/img/seafile-history/in-library.png">}}

click on the history icon:

{{<figure src="/img/seafile-history/history-library.png">}}

choose a snapshot:

{{<figure src="/img/seafile-history/history-folder.png">}}

navigate as you wish:

{{<figure src="/img/seafile-history/history-nested-folder.png">}}

then either restore or download the file:

{{<figure src="/img/seafile-history/history-file.png">}}

Neat huh - unfortunately it is only on the web, not the local sync client - I wonder if the client doesn't have all the required meta-data.

It is also blindingly quick.

I achieved a very similar thing at work using event-streams - the 'historical view' was literally just a fold over all events up to that point in time - but that is going to have to wait for another day :-).