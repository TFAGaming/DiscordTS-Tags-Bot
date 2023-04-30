# DiscordTS-Tags-Bot
A similar project to [TFAGaming/Tags-System-Discord-Bot](https://github.com/TFAGaming/Tags-System-Discord-Bot), but has many features, bug fixes, and written in TypeScript.

This project is made for programming servers where the server members helps each other by using tags. They can create a tag easily by using the command `/tag create` and view it by `/tag view`.

# Table of Contents
- [DiscordTS-Tags-Bot](#discordts-tags-bot)
- [Table of Contents](#table-of-contents)
- [Preview](#preview)
    - [/tag create](#tag-create)
    - [/tag view](#tag-view)
    - [/tag list](#tag-list)
    - [/tag my-tags](#tag-my-tags)
    - [/tag delete](#tag-delete)
- [Installation](#installation)
    - [Requirements](#requirements)
        - [Optional](#optional)
    - [Start up your project](#start-up-your-project)
- [FAQs](#faqs)

# Features
- Simple & easy to understand.
- Max tags per guild members.
- Non-multiguild bot (cannot be a public bot).
- Tags visibility: **Public**, **Unlisted**, and **Private**.
- Using MongoDB as tags Database, and JSON as a configuration Database file.
- Powerful.

# Preview
## /tag create
Creates a new tag on the MongoDB Database, and saves the content of the message.

![2023-04-29 19_13_35-#report-channel _ The unverified bots gang - Discord](https://user-images.githubusercontent.com/92172698/235318952-db9aa289-ef5d-448f-b9f7-4a7addf82d61.png)

![2023-04-29 19_14_14-#report-channel _ The unverified bots gang - Discord](https://user-images.githubusercontent.com/92172698/235318955-8f06421c-866b-4af3-9282-7319b4dc36aa.png)

![2023-04-29 19_14_19-#report-channel _ The unverified bots gang - Discord](https://user-images.githubusercontent.com/92172698/235318959-cd0f6a5d-28bc-4701-90bd-ee1ea26017a0.png)

## /tag view
Replies with the tag content, date of creation, the author, and it's visibility.

![2023-04-29 19_14_37-#report-channel _ The unverified bots gang - Discord](https://user-images.githubusercontent.com/92172698/235318968-c85fcd5b-f3b4-4dfc-9b02-877471dbd601.png)

## /tag list
Replies with a Buttons paginator filled with public tags.

![2023-04-29 19_15_26-#report-channel _ The unverified bots gang - Discord](https://user-images.githubusercontent.com/92172698/235318970-2d4e3919-1af8-42b2-9495-ce111fb44548.png)

## /tag my-tags
Replies with a Buttons paginator filled with public, private, and unlisted tags that you have created.

![2023-04-29 19_15_38-#report-channel _ The unverified bots gang - Discord](https://user-images.githubusercontent.com/92172698/235319005-fa0ce059-6ebe-4916-a91a-5e8e64b34213.png)

## /tag delete
Deletes a tag that you have created in the Database.

![2023-04-29 19_17_51-#report-channel _ The unverified bots gang - Discord](https://user-images.githubusercontent.com/92172698/235318980-827c80b4-81e2-4521-95ff-b3e35b6b69a8.png)

# Installation
## Requirements
- Software
    - **Node.js** version ^16.9.0: [Click to download](https://nodejs.org/en/download)
- Libraries
    - **discord.js** version ^14.9.0: `npm install discord.js@14`
    - **utilityxtreme** version ^latest: `npm install utilityxtreme`
    - **mongoose** version ^latest: `npm install mongoose`
    - **simple-json-db** version ^latest: `npm install simple-json-db`
    - **dotenv** version ^latest: `npm install dotenv`

### Optional
- Software
    - **Visual Studio Code** version ^latest: [Click to download](https://code.visualstudio.com/download)

## Start up your project
1. Install TSC (**T**ype**S**cript **C**ompiler) from npm globally:

```
npm install -g tsc
```

2. Create a new npm project and then install the required dependencies:
```
npm init -y
npm install discord.js@14 utilityxtreme mongoose simple-json-db dotenv
```

3. Rename `.env.example` to `.env` and then fill all the required keys' values in that file.

4. Compile the TypeScript files into JavaScript files:
```
npm run build
```

# FAQs
## What's the difference between `/tag list` and `/tag my-tags`?
The both commands are having the same job, showing all the tags that are in the Database but each one is having a custom filter. The first command (`/tag list`) shows **only** public tags, including yours. The second command (`/tag my-tags`) shows the tags that you have created, including private, unlisted, and public tags.

## What is a tag visibility?
The tag visibility is having three types: **Public**, which can be viewed by everyone. **Unlisted**, which can be viewed by everyone, but not listed in `/tag list`. **Private**, which can be viewed by the author in DMs. It is similar to YouTube, but not 100%.
