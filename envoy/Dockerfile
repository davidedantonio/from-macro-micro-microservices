FROM envoyproxy/envoy:v1.20.0
RUN apt-get update && apt-get -q install -y \
    curl
CMD /usr/local/bin/envoy -l debug -c /etc/api-envoy.yaml