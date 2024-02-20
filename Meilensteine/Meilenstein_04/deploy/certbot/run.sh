#!/bin/bash
certbot certonly --non-interactive --agree-tos --standalone --email $(cat $ADMIN_EMAIL) -d swp.dczlabs.xyz
sleep 30
/deploy.sh
while :
do
    CERTNAME="cert$(date +'%H-%M-%j-%Y')"
    certbot renew --deploy-hook "/deploy.sh"
    sleep $((60*60*24*2 + 31))
done
