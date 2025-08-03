# Ketsuna (Back/Front)

This is the full back-end and front-end of Ketsuna. It is a REST API built with [Node.js](https://nodejs.org/en/) and [Fastify](https://www.fastify.io/). It also contains a [Discord bot](https://discord.com/developers/docs/intro) that is used to communicate with the Discord API.
The Front-end is built with [React](https://reactjs.org/) and [Next.js](https://nextjs.org/).

# Morgane Ai Information : 

- Support : https://discord.gg/2U6Q9aKHSE
- Top.gg : https://top.gg/fr/bot/1190014646351036577
- Invitation link: https://discord.com/oauth2/authorize?client_id=1190014646351036577&permissions=551903627328&scope=bot

## Features

- [x] Discord bot
- [x] REST API
- [x] Front-end

## Requirements

- [Node.js](https://nodejs.org/en/) (v20.0.0 or higher)
- [Prisma](https://www.prisma.io/) (v3.0.0 or higher)
- [PNPM](https://pnpm.io/) (v6.0.0 or higher)

### Ubuntu / Debian

1. Node.js 
	- Check to be well In your original directory 
	- `cd ~`
	- use curl to retrieve nodejs version 20 installation script 
	- `curl -sL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh`
	- Inspect the contents of the downloaded script with nano (or your favorite text editor): 
	-`nano nodesource_setup.sh`
	- You can now install the Node.js package the same way you did in the previous section: 
	-`sudo apt install nodejs`

2. Dependencie 
  - `apt install ffmpeg -y`
  - `sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp
    sudo chmod a+rx /usr/local/bin/yt-dlp
    yt-dlp --version`

3. Prisma
	- Normally no manual installation required

4. 
	- regular version of pnpm, which needs Node.js to work.
	- `npm install -g pnpm or npm install -g @pnpm/exe`

5. I advise you to install pm2 
	- `npm install pm2 -g`

Now you can follow the installation instructions

## Installation

1. Clone the repository
2. Install the dependencies with `pnpm install`
3. Create a `.env` file in the root directory and fill it with the following variables:

```env
    # The port the server will listen on
    PORT=3000
    # The Discord bot token
    DISCORD_TOKEN=
    # Config the Discord Status
    DISCORD_STATUS_NAME=The best Bot ever
    DISCORD_STATUS_STATE=The Best AI Bot
    # Number of servers per shard, 15 is the default number and it is recommended to put 15 to 200 servers per shard for optimal operation
    SERVERS_PER_SHARD=15
    # Owner ID for whitelist command
    OWNER_ID=
```

Check that the `.swcrc` file is created in the root directory and fill it with the following variables:

```
{
  "jsc": {
    "target": "es2020",
    "parser": {
      "syntax": "typescript",
      "tsx": false,
      "decorators": true,
      "dynamicImport": true
    },
    "transform": {
      "react": {
        "runtime": "automatic"
      }
    }
  },
  "module": {
    "type": "commonjs",
    "strict": true,
    "strictMode": true,
    "noInterop": false
  },
  "minify": false,
  "sourceMaps": true
}
```

4. Run the database migrations with `pnpm migrate` (this will create the database tables)
5. Build the project with `pnpm build` and `pnpm add sharp`
6. Run the project with `pnpm start` or `node dist/main.js` or with pm2 `pm2 start npm --name "your-app-name" -- start`
6. Run the project with Shards with `node dist/shard.js` or with pm2 `pm2 start dist/shard.js --name "shardingstarting" -- start`

## Updating

1. Pull the repository with `git pull`
2. Install the dependencies with `pnpm install`
3. Run the database migrations with `pnpm migrate`
4. Build the project with `pnpm build`
5. Restart the project with `pm2 restart your-app-name`

Or if you don't want to "build" the project :

1. Change the branch to `prod` with `git checkout prod`
2. Same as above but without the `pnpm build` step

## Usage

### Discord bot

The Discord bot is used to communicate with the Discord API and the Horde AI API. It currently has the following commands:

- Decriptions of commands
1. `/ia imagine` - Create an image by AI
2. `/ia login` - Login to stablehorde.net
3. `/ia help` - Show IA help
4. `/ia info` - Show user informations
5. `/ia logout` - Logout to stablehorde.net
6. `/ia ask` - Ask a question to the AI
7. `/ia interogate` - Interrogate the AI
8. `/ia give` - Give kudos to an user
9. `/ia config` - Configure the AI
10. `/ia advanced` imagine - Create an image by AI

### Website

The website is used to interact with the Discord bot. It currently has the following pages:
/ (The home page)  
/cgu (The CGU page)
/privacy (The TOS page) 

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Contributors

- [garder500](https://github.com/garder500) - creator and maintainer
- [trail-l31](https://github.com/trail-l31) - contributor
- [celesteoffi](https://github.com/celesteoffi) - Keeps the script working

## License

This project is licensed under the [MIT License](https://opensource.org/license/mit/)

```
MIT License
-----------
© 2023 Jeremy S.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

```
