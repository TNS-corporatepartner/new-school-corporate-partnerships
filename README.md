# The New School Corporate Partners Site

## Overview
This site is hosted on Github Pages. For simple text changes, it is easiest to make updates via [Siteleaf](https://manage.siteleaf.com/). Alternatively, edits can be made directly to the code hosted on Github. Please see the sections below for instructions on how to make updates in either scenario. 


## Updating Content via Siteleaf
Siteleaf provides multiple content types (such as Pages, Collections, Posts, etc). Since this website is a single page, all content is saved to Siteleaf as different *Collections*. You can read more about Collections [here](https://learn.siteleaf.com/content/collections/).

To modify content, login to [Siteleaf's Admin Panel](https://manage.siteleaf.com/). Along the left-hand side, you will find blue icons, each of which represents a different Siteleaf Collection. Each Collection was created to correspond to a single scroll-snap section of the site. Click the Collection that you would like to modify, make the updates, and click the green "Save" button at the top-right of the screen. 

After clicking save, updates should immediately show up on the [live site](http://corporatepartner.newschool.edu/). 

If you do not see the content you're looking to modify, try looking at the _config.yml file inside Github.


## Updating Content/Code via Github
If you would like to modify the code directly, you will need to be added as a collaborator to [The Corporate Partners Repo](https://github.com/TNS-corporatepartner/new-school-corporate-partnerships). Collaborators can be added in the Settings panel of the repo.

Once you have cloned the repo to your machine, you can start a local dev server by first running `npm install`, then `npm start` after the installation has succesfully completed. `npm start` should be ran every time you are developing locally. Behind the scenes, this starts a jekyll server and a webpack watch task. If you run into issues, please ensure that [npm](https://www.npmjs.com/), [jekyll](https://jekyllrb.com/), and [webpack](https://webpack.github.io/) are installed. 

**Any commits pushed to the master branch will be immediately reflected on the live website.**


### Notes about jekyll
The jekyll server will compile any changes into the `_site` folder. Never make changes to the files inside of `_site` directly. This site folder is gitignored because Siteleaf is intended to use with Jekyll and will handle compiling. 


### Notes about webpack
If you make changes to the javascript or SCSS, ensure that the webpack task is running (`npm start` does this for you). Before committing changes, run `npm run build` to compile production-ready versions of the static resources.
