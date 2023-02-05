# AnxietyJournal ![Logo](https://github.com/F0903/AnxietyJournal/blob/master/.github/media/AnxietyJournal%20Logo%202525.png)

[![CI](https://github.com/F0903/AnxietyJournal/actions/workflows/main.yml/badge.svg)](https://github.com/F0903/AnxietyJournal/actions/workflows/main.yml)
[![CodeQL](https://github.com/F0903/AnxietyJournal/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/F0903/AnxietyJournal/actions/workflows/codeql-analysis.yml)

**NOTE: This project was made to learn Electron development without any external framework (such as React), but might be rewritten in such a framework at some point.**

A simple tool for taking note of when you are anxious, or journaling anxiety-provoking events.

You can find the latest stable installer under the releases tab, or the latest unstable under the most recent CI action. :)

NOTE: Requires Josefin Sans font (will be bundled at a later date), and MongoDB server installed.

Data will be stored locally unencrypted on MongoDB, the app does also not have access to the remote module (data cannot be uploaded to the web) and uses IPC for passing data.
