FROM envoyproxy/envoy-dev:latest

RUN apt-get update && apt-get -q install -y \
    curl
CMD /usr/local/bin/envoy -l debug -c /etc/api-envoy.yaml