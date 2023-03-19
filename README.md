# CLImate
Escape game in which your character can only execute actions with the help of UNIX commands.

## Installation
```bash
# Client side
cd client
yarn install
yarn dev
```

```bash
# Server side
cd server
yarn install
yarn dev
``` 
A Dockerfile will be created to make things easier.

## Technical stack
Client and server sides will both use Typescript.

**Client**
* React.js (bootstrapped with Vite)
* Phaser

**Server**
* Express
* Prisma
* PostgreSQL

## Why ?
The reason of this project is that I want to provide an educational and fun tool to familiarize people (non-dev included) to some basic UNIX commands. As a developer, I use these commands in my daily life because they are straightforward and help me a lot for simple and complex tasks.

A CLI (and code in general) can look tough at first sight. Also, based on what I saw, non-dev people can be affraid of some lines of simple programs, regardless of their age ; they also can think that coding is beyond understanding. And I guess their reactions would be the same if they were in front of a CLI.

So I was thinking about a fun way to teach people UNIX commands, while trying to make these authentic and reproduceable in real life. And I guess one good way to do it would to make an escape game about it. The aim is to make a character escape from a building, but the only way to lead it out is to use UNIX commands.

For example, you would go to a room from another with the `cd` command. No arrow keys to move the character, no mouse events to interact : just keyboard commands!