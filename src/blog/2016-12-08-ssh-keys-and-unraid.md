---
layout: ../../layouts/MarkdownPostLayout.astro
title: "SSH Keys and unRAID"
pubDate: 2016-12-08
tags: ["unraid", "ssh"]
---

I wanted to `rsync` some data directly to and from my [unRAID](https://lime-technology.com) server. (And yes, the eagle eyed amongst you will remember I moved away from it [previously](https://colinyates.co.uk/posts-output/2016-11-18-nas-fun/). I'm back, but that's for another post.)

The problem is that `sshd` is a pig about permissions and whilst `unRAID` does come with some persistent SSH keys, because of the underlying file system (exFAT or FAT32) the permissions are too strict.

So, what to do?

Well, as I am sure you know, SSH is all about two files, a private one you own and protect and a public one which you can give out willy-nilly. _Usually_ those are `.ssh/id_rsa` and `.ssh/id_rsa.pub` but they can actually come from anywhere.

The plan is therefore straightforward:

1. Find a sensible file system
2. Generate a new SSH key pair onto that file system
3. Copy the `.pub` to the client machine
4. `ssh` using that key

Specifically I am `rsync`ing, but let's create the keys first.

# Generate the keys and secure them

Given `unRAID` is all about your shares, and those shares live on an XFS filesystem, why not choose a (very secure and not public!) share? I therefore created one share called "vault", locked it down in `unRAID` and created the relevant keys:

```bash
mkdir /mnt/user/Vault
ssh-keygen -t RSA -f /mnt/user/Value/clientA
```

(_make sure you don't use a passkey for the SSH keys themselves_)

This creates `/mnt/user/Vault/clientA` and `/mnt/user/Value/clientA.pub`. The `.pub` is the public key you can throw around with abandon. The one without the `.pub` is your private one which you want to wrap in tinfoil and put in a locked box.

The permissions for both should be no more than 0600 (user read and write only), but `ssh-keygen` does that automatically. If not then a `chmod 0600 <clientA>*` will suffice.

# Copy the `.pub` to the client machine

Simple as `ssh-copy-id -l <the remote user> -i /mnt/user/Vault/clientA.pub <the remote server>` . Note you are copying the `.pub`lic key, not the private one! Enter the password and that if it all goes well that is the last time you need to enter that password ;-).

# SSH using that key

A subsequent `ssh -l <the remote user> -i /mnt/user/Vault/clientA.pub <the remote server>` should get you in immediately.

Great, but what has this got to do with `rsync`? Well, `rsync` and _many_ other things work over `ssh`. All we need to do is tell `rsync` which key to use:

```bash
rsync -avz --stats --progress --rsh="ssh -l <the remote user> -i /mnt/user/Vault/clientA" <the remote IP>:<the path you want to retrieve> <the local dir the remote dir will sync to>
```

_(note, you want to reference your private key here_)

So, if my remote username is "bobby", the server is called "bobserver", the remote directory is "/opt/photos" and it is going be stored into `/mnt/user/BobsBackup` I would do the following:

```bash
ssh-keygen -t rsa -f /mnt/user/Vault/bobby
ssh-copy-id -i /mnt/user/Vault/bobby.pub bobby@bobserver
rsync -avz --stats --progress -rsh="ssh -l bobby -i /mnt/user/Vault/bobby" bobserver:/opt/photos /mnt/user/BobsBackup
```

The next job is to add a `cron` job to do the `rsync` at a regular schedule. That is a post for another day (trivially editing `/boot/config/go` really, but my tea is ready :-))

# A variation

If you didn't want to create your keys on a share then the alternative would be to edit `/boot/config/go` to copy the keys (maybe even the already existing `/boot/config/ssh/*.keys`) onto a sensible file system, `chmod 0600` them and then reference those.

Great - go for it :-).
