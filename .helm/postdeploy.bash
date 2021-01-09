#!/bin/bash

sudo sed -i -e '/^.*cocina-dev.loc\.loc.*$/d' /etc/hosts
echo `minikube ip`" cocina-dev.loc" | sudo tee -a /etc/hosts
