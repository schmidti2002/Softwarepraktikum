#!/bin/bash
CERTNAME="cert$(date +'%H-%M-%j-%Y')"
cat /etc/letsencrypt/live/swp.dczlabs.xyz/fullchain.pem  \
      /etc/letsencrypt/live/swp.dczlabs.xyz/privkey.pem > bundle.pem

curl -X PUT --data-binary @bundle.pem  \
       "http://server.local:1234/certificates/certbot$CERTNAME"

curl -X PUT --data-binary "{\"pass\": \"routes\", \"tls\": {\"certificate\": \"certbot$CERTNAME\"}}" \
      'http://server.local:1234/config/listeners/*:3130'
