#!/bin/bash

sudo sed -i -e "/^.*cocina-$shortenv\.loc.*$/d" /etc/hosts
echo `minikube ip`" cocina-$shortenv.loc" | sudo tee -a /etc/hosts
