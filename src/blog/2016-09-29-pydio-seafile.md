---
layout: ../../layouts/MarkdownPostLayout.astro
title: "Secure file sharing in the cloud"
pubDate: 2016-09-29
tags: ["cloud", "pydio", "seafile"]
---

We occasionally need to share sensitive files with our clients: new deployment bundles, test data etc. Due to the sensitive nature of our work we _must_ have the following:

- strong usernames/passwords
- no client installation so a decent web UI is necessary
- encryption in transit and at rest

And as I will be administering it, it must also:

- be trivial to install and upgrade
- not break when you upgrade the OS

As this is an experiment I want to self-host (as that increases security somewhat) and all the hosted options I have looked at are either too expensive or too cumbersome.

## Pydio

For a while I used [pydio](https://pydio.com) and it was fine. Installation was tricky (although it has gotten much better recently) but once it was working it was pretty solid.

It did the following very well:

- a good Linux citizen, config files in the right places for the distribution
- very rounded web UI
- all the files are stored 'as-is' so last-resort backup is as simple as rsync

The major downsides however:

- everything is stored under www-data and permissions are at the application level
- upgrading Ubuntu to the latest LTS broke it horribly, probably because PHP changed significantly
- sharing between clients never seemed to work properly so we had to copy the same release artifacts between accounts
- the pydio admin would need to issue a username and password which the client never bothered to change

However, other than those issues (which are all well documented) pydio was fine for sharing via the web.

## Seafile

I noticed [seafile](https://www.seafile.com/en/home/) when I was first evaluating solutions a while ago. It seemed more focused at file sharing/synchronising than cloud sharing so I dismissed it. However, it seems to have matured nicely and offers a lot out of the box:

- everything is a [library](https://www.seafile.com/en/help/libraries/) which you can share with others
- libraries can be [encrypted](https://www.seafile.com/en/help/encrypted_libraries/) (although there are serious concerns over its encryption)
- users were invited with an email and password which they were forced to change
- uploads and downloads could be done with [security-by-obfuscation](https://www.seafile.com/en/help/share/) URLs which could be password protected and expired
- their [desktop client](https://www.seafile.com/en/help/install/) allows you to sync locally or browse remotely on a library by library basis

The installation was a peach, the simplest (backup) non-trivial software I have ever installed. It was literally get a fresh debian/ubuntu machine and then run the [installation script.](https://github.com/seafile/seafile-server-installer).

After that it was a case of regenerating the SSL and installing it by editing (on debian at least) `/etc/nginx/conf.d/seafile.conf` to point to the key and the crt:

```
server {
  listen       80;
  server_name  "";
  return 301 https://$http_host$request_uri;
}

server {
  listen 443;
  server_name  "";

### START - THIS IS WHAT YOU NEED TO CHANGE ###
  ssl on;
  ssl_certificate /etc/ssl/certs/<YOUR-SERVER>_bundle.crt; # /etc/nginx/ssl/seafile.crt;
  ssl_certificate_key /etc/ssl/private/<YOUR-SERVER>.key; # /etc/nginx/ssl/seafile.key;
### END - THIS IS WHAT YOU NEED TO CHANGE ###

  proxy_set_header X-Forwarded-For $remote_addr;

  location / {
    fastcgi_pass    127.0.0.1:8000;
    fastcgi_param   SCRIPT_FILENAME     $document_root$fastcgi_script_name;
    fastcgi_param   PATH_INFO           $fastcgi_script_name;
    fastcgi_param   SERVER_PROTOCOL     $server_protocol;
    fastcgi_param   QUERY_STRING        $query_string;
    fastcgi_param   REQUEST_METHOD      $request_method;
    fastcgi_param   CONTENT_TYPE        $content_type;
    fastcgi_param   CONTENT_LENGTH      $content_length;
    fastcgi_param   SERVER_ADDR         $server_addr;
    fastcgi_param   SERVER_PORT         $server_port;
    fastcgi_param   SERVER_NAME         $server_name;
    fastcgi_param   REMOTE_ADDR         $remote_addr;
    fastcgi_param   HTTPS               on;
    fastcgi_param   HTTP_SCHEME         https;
    access_log      /var/log/nginx/seahub.access.log;
    error_log       /var/log/nginx/seahub.error.log;
  }

  location /seafhttp {
    rewrite ^/seafhttp(.*)$ $1 break;
    proxy_pass http://127.0.0.1:8082;
    client_max_body_size 0;
    proxy_connect_timeout  36000s;
    proxy_read_timeout  36000s;
    proxy_send_timeout  36000s;
  }

  location /media {
    root /opt/seafile/seafile-server-latest/seahub;
  }

  location /seafdav {
    fastcgi_pass    127.0.0.1:8080;
    fastcgi_param   SCRIPT_FILENAME     $document_root$fastcgi_script_name;
    fastcgi_param   PATH_INFO           $fastcgi_script_name;
    fastcgi_param   SERVER_PROTOCOL     $server_protocol;
    fastcgi_param   QUERY_STRING        $query_string;
    fastcgi_param   REQUEST_METHOD      $request_method;
    fastcgi_param   CONTENT_TYPE        $content_type;
    fastcgi_param   CONTENT_LENGTH      $content_length;
    fastcgi_param   SERVER_ADDR         $server_addr;
    fastcgi_param   SERVER_PORT         $server_port;
    fastcgi_param   SERVER_NAME         $server_name;
    fastcgi_param   REMOTE_ADDR         $remote_addr;
    fastcgi_param   HTTPS               on;
    client_max_body_size 0;
    access_log      /var/log/nginx/seafdav.access.log;
    error_log       /var/log/nginx/seafdav.error.log;
  }
}
```

We had to use the 'bundle' crt because godaddy's SSLs signing authority isn't always recognised so the crt is actually the result of:

```bash
cat <YOUR-SERVER>.crt gd_bundle.crt > <YOU-SERVER>_bundle.crt
```

After a few days usage I am very impressed. The web UI isn't great but it all seems to be very solid and reliable.

And wow, does it sync quickly! It uses [delta syncing](https://en.wikipedia.org/wiki/DeltaSync) but the initial upload was really quick as well.

It also has a huge feature, which is sorely missing in a lot of these cloud servers, which is you can browser a library from your desktop client without it syncing, so it isn't going to overwhelm the pitifully small SSDs most laptops come with these days.

So yes, all in all, very pleased with it.
