# Password reset with Selenium in Node (using Mailisk)

This is an example app that shows how to use Selenium to test password reset functionality. It uses the [mailisk](https://github.com/mailisk-app/mailisk-node) library.

This example includes a simple full stack React (NestJS) and Express application. The Express server uses [Mailisk SMTP](https://mailisk.com/blog/blog/smtp-now-available) to send emails.

## Install packages

You will need to install packages in all directories. Run the following command in the root directory:

```shell
npm --prefix ./server install ./server \
npm --prefix ./app install ./app \
npm --prefix ./tests install ./tests
```

## Setup

### Get namespace and api key

The Api Key and namespace can be found in your dashboard. See the [Getting Started](https://docs.mailisk.com) guide for detailed steps

Create a `.env` file in the root project directory. Add the following lines from your settings:

```ini
API_KEY=<api key>
NAMESPACE=<yournamespace>
```

## Running the app and server

Head into the `app` folder and run:

```shell
npm run dev
```

Then go into the `server` folder and run:

```shell
npm run dev
```

## Running tests

To run the test go into the `tests` folder and run:

```shell
npm run start
```
