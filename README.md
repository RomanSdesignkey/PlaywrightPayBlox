For the first project init use:
sudo bash init.sh

To build and run use next:
sudo docker compose up --build -d

To up containers use:
sudo docker compose up -d

To run tests use:
sudo docker compose up playwright-tests

To stop and remove comtainers use: 
sudo docker compose down -v

To stop comtainers use:
sudo docker compose down

Allure reports could be checked here:
http://localhost:5050/allure-docker-service/projects/default/reports/latest/index.html

For remove node_modules use:
sudo rm -rf node_modules

For remove all docker containers, volumes and networks:
docker system prune -a --volumes



Optional you could switch between UI and headless mode (you need to comment/uncomment some lines in docker-compose.yml and Dockerfile and rebuild containers):
Run test in UI mode:
Uncomment in docker-compose.yml:
    command: ["npx", "playwright", "test", "--ui", "--ui-host=0.0.0.0", "--ui-port=8080"] # run in UI mode

Uncomment in Dockerfile:
    CMD ["npx", "playwright", "test", "--ui", "--ui-host=0.0.0.0", "--ui-port=8080"]


Run test in headless mode:
Uncomment in docker-compose.yml:
    command: ["npm", "run", "test"] # run in headless mode

Uncomment in Dockerfile:
    CMD ["npm", "run", "test"]


    To Refresh Token 
    1. Go to keys > delete token 
    2. Switch to headless mode (not UI)
    3. build run command in terminal - sudo docker compose build 
    4. run container sudo docker compose up playwright-tests
    5. navigate to link in browser where gmail is open 
    6. authorise 
    7. ctrl + c 
    8. change to ui mode again 

