lone the project repository
Open your terminal and type:
git clone https://github.com/YOUR_USERNAME/chat-app.git
Then navigate into the project directory:
cd chat-app


Install Wrangler (Cloudflare's CLI tool)
Run the following command:
npm install -g wrangler

Login to your Cloudflare account
Type the following and press enter:
wrangler login
This will open a browser window to authenticate with your Cloudflare account.

Navigate to the Worker folder
In the terminal, type:
cd worker

Create or update your wrangler.toml file
Make sure the file contains the following configuration:
/toml/
name = "chat-worker"
main = "worker.js"
compatibility_date = "2024-05-01"

[durable_objects]
bindings = [{ name = "ROOMS", class_name = "Room" }]

[[migrations]]
tag = "v1"
new_sqlite_classes = ["Room"]
/toml/


Deploy the WebSocket Worker to Cloudflare
Run:
wrangler deploy
After deployment, you’ll get a link like:
https://chat-worker.YOURNAME.workers.dev

Update the WebSocket URL in your frontend JavaScript
Open the file public/app.js
Find this line:
const ws = new WebSocket(`wss://chat-worker.YOURNAME.workers.dev/room/${room}?name=${name}`);
Replace YOURNAME with your actual Worker subdomain. For example:
const ws = new WebSocket(`wss://chat-worker.ishanislam13.workers.dev/room/${room}?name=${name}`);

Upload ypur frontend into a Git Repo


Deploy the frontend using Cloudflare Pages
Go to Clouflare, go to Worker and Pages, click Pages, connect your Git Repo, and Deploy

Visit the deployed frontend URL
Cloudflare will give you a URL like https://your-project.pages.dev.
Open it in your browser, enter a name and room code, and start chatting in real time!