# wiremock-advanced
A example Image for extending a wiremock, with static content, controlled by nginx based on fedora.

[![wiremock](static/img/wiremock_logo.png)](https://wiremock.org/)
[![nginx](static/img/nginx-logo.png)](https://www.nginx.com/)
![docker](static/img/docker.png)

## How to create the image
Example:
```bash
docker build -t wm-adv:v1 .
```

## How to run the container
Example:
```bash
docker run -p 8090:80 wm-adv:v1
```

## Test container

### Show index.html of static content
```shell
curl http://localhost:8090
```
or http://localhost:8090/

### Show wiremock mappings
```shell
curl http://localhost:8090/api/__admin/mappings
```

### Mocked Data
* http://localhost:8090/api/v1/getWeather?city=Halifax
* http://localhost:8090/api/geocode/v1/json?q=Halifax
* http://localhost:8090/api/forecast/apikey123/44.648618,-63.5859487?units=uk2

# Git Setup
Avoid:  >LF will be replaced by CRLF the next time Git touches it
```bash
git config --global core.autocrlf false
```

# Nice to know

## Start official wiremock container
```bash
docker run -it --rm \
  -p 8080:8080 \
  --name wiremock \
  wiremock/wiremock:3.5.4
```

## Nginx commands
* [How to restart Nginx on Linux using the CLI - nixCraft](https://www.cyberciti.biz/faq/nginx-linux-restart/)