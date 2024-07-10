# wiremock-advanced
A example Image for extending a wiremock, with static content, controlled by nginx based on fedora.

[![wiremock](static/img/wiremock_logo.png)](https://wiremock.org/)
[![nginx](static/img/nginx-logo.png)](https://www.nginx.com/)
![docker](static/img/docker.png)

- [wiremock-advanced](#wiremock-advanced)
  - [TODOS](#todos)
  - [How to create the image](#how-to-create-the-image)
  - [How to run the container](#how-to-run-the-container)
  - [Execute Newman](#execute-newman)
  - [Test container](#test-container)
    - [Show index.html of static content](#show-indexhtml-of-static-content)
    - [Show wiremock mappings](#show-wiremock-mappings)
    - [Mocked Data](#mocked-data)
- [Git Setup](#git-setup)
- [Nice to know](#nice-to-know)
  - [Start official wiremock container](#start-official-wiremock-container)
  - [Nginx commands](#nginx-commands)

## TODOS
  * ✅ add newman
  * ✅ add enpoint that returns all postman-collection names
  * ✅ add enpoint that takes name of the postman-collection to execute
  * ✅ [🕵️‍♂️ Newman Manager](newman-ui/README.md) - still in progress
  * ✅ add Newman Manager to image
  * add collection that calls wiremock mockdata
  * 🔌👨‍💼 Wiremock-Manager
    * Dashboard-Page
      * is wiremock up
      * number of mappings
      * number of journal-entries
    * Mappings-Manager
      * list all stored mappings
      * add a new mapping (as text)
      * add a new mapping - postman-editor style


## How to create the image
Example:
```bash
docker build -t wm-adv:v1 .
```

## How to run the container
Example:
```bash
docker run -p 8090:80 -p 3000:3000 -p 4000:4000 wm-adv:v1
```

## Execute Newman
* http://localhost:8090/newman/nm

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
or http://localhost:8090/api/__admin/mappings


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