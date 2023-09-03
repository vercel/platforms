## Accessing Next.js dev server using HTTPS

Inspired by https://www.makeswift.com/blog/accessing-your-local-nextjs-dev-server-using-https

This is a workaround for the issue that Next.js dev server doesn't support HTTPS.
It requires mkcert to be installed on your machine.
Read above blog post for more details.


### Run the following commands to start the dev server:
```bash
brew instal mkcert
cd .dev/
mkcert -install
mkcert localhost
pnpm dev
```

Visit https://localhost:3000 in your browser.  
You should see a warning about the certificate not being trusted.  
This is expected.  
Click on "Advanced" and then "Proceed to localhost (unsafe)".
