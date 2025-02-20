# Ivory (postgres / patroni cluster management tool)

Ivory is an open-source project which is designed to simplify and visualize work with postgres clusters.
Initially, this tool was developed to simplify the life of developers who, in their work, maintain postgres, but
I hope it will help to manage and troubleshoot postgres clusters not only for developers, but for more
experienced people with postgres.

Ivory can be used as a local tool in your personal computer for your personal needs and as a standalone tool
in some remote VM for group usage.

## Get started

1. Start the docker container
2. Go to http://localhost
3. Do the initial configuration (Ivory will guide you)
4. Add your first cluster (by providing name and instances)
5. Start monitoring :) 

You can simply start and run container from Docker Hub or GitHub Container repository

- Docker Hub `docker run -p 80:80 --restart always aelsergeev/ivory`
- GitHub Container repository `docker run -p 80:80 --restart always ghcr.io/veegres/ivory`

## Guide

### Data

All Ivory data is located inside `/opt/data` package. Ivory has a docker volume, it means that you won't
lose it if your container a going to be rebooted. But you need to consider mount this package to your 
local disk if you want to save the data between different containers 
`--mount type=bind,source=YOUR_LOCAL_PATH,target=/opt/data`, or you can mount volume of the 
old container to the new one by docker flag `--volumes-from`

### Authentication
Ivory can work with or without authentication. It can be configured in the initial start. Right now
Ivory supports only _Basic_ authentication with general username and password (maybe in the future support
will be added for such things like ldap / sso)
Usually you don't want to use authentication when you work with Ivory locally, but it is recommended
to use it if you put it globally.

### Usage
- [keep all of your cluster in one place](doc/clusters.md)
- [monitor cluster status, do reinit and switchover](doc/overview.md)
- [edit cluster config](doc/config.md)
- [monitor and clean bloat](doc/bloat.md)
- [troubleshoot particular instance](doc/instance.md)

![Demo](doc/images/demo.gif)


## Contribution

If you're interested in contributing to the Ivory project:

- [Enhancements](https://github.com/veegres/ivory/issues)
- [Good for newcomers](https://github.com/veegres/ivory/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- [Supported versions](SECURITY.md)
- [Setup Local Environment](docker/development/README.md)
- [Build Frontend](web/README.md)
- [Build Backend](service/README.md)
