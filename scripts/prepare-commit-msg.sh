#!/bin/bash

# Checks the standard output to see if the user is using a GUI or the command line
if [ -t 1 ]; then
  # Allows user keyboard input and sets the standard input as the command line if that is the case.
  exec < /dev/tty
  red=$"\e[0;91m"
  green=$"\e[0;32m"
  bold=$"\e[1m"
  reset=$"\e[0m"
else
  red=$""
  green=$""
  bold=$""
  reset=$""
fi

# Checks the standard output to see if the user is using a GUI or the command line
if [ -t 1 ]; then

  # Prompts the user to describe the changes they are making.
  echo -e "${bold}What type of change are you making?${reset}"
  echo "It is likely one of the following: build, ops, infra, docs, feat, fix, perf, refactor, style, test, breaking"
  read -r -p "Change Type: " CHANGETYPE

  # Prompts the user for their commit message.
  echo -e "${bold}What day of the training is it?:${reset}"
  read -r -p "Day of the training: " DAY


  # Prompts the user for their commit message.
  # echo -e "${bold}Please describe the changes you made below:${reset}"
  # read -r -p "Your Commit Message: " MESSAGE

  # Checks to make sure that "git commit" was not run using any of these options: message, template, merge, or squash
  if [[ -z "$COMMIT_SOURCE" ]]
  then

  # Saves the standard commit message hint to be added back later.
  MESSAGE=$(cat ".git/COMMIT_EDITMSG")

  # Places the pieces of the regex string into the commit messages.
  echo "$CHANGETYPE(DAY$DAY): $MESSAGE" > ".git/COMMIT_EDITMSG"

  # Adds the standard hint back to the commit message.
  # echo "$hint" >> ".git/COMMIT_EDITMSG"

  fi
else
  # Bypasses commit message prompts if using a GUI
  echo "It seems you are using a GUI to interact with Git..."
  exit 0;
fi

COMMIT_REGEX='^\w*\(.+\):\s.+'
ERROR_MSG="${bold}${red}Aborting commit. Your commit message is not properly formatted.${reset}"

if ! grep -iqE "$COMMIT_REGEX" ".git/COMMIT_EDITMSG";
then
  echo -e "$ERROR_MSG" >&2
  echo -e 'An example commit would be: "infra(git-hook-setup): SENATE-2897: Adding pre-commit and pre-push git hooks using bash scripts"'
  exit 1
else
  echo -e "${green}(ु⁎◡_◡⁎)ु.｡oO(Your wish is my command...)${reset}"
fi
