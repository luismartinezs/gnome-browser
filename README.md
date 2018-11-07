# BRASTLEWARK GNOME LOCATOR APP

## App description

Players arriving to the city of Brastlewark (a populous Gnomish city) can easily and quickly find Gnomes in the app and browse the details of each Gnome.

Gnome's physical attributes described in each profile will help players identify a given Gnome.

Players looking for specific Gnomes can filter Gnomes by name, by profession and by age range.

Filtering by attributes such as height, weight or hair color was deemed not useful since these don't bear any relevance to quests, hypothetically. However if players ardently request this feature, it could be added in future updates.

We wanted to provide just the basic functionality quickly so that players could begin interacting with the app as soon as possible. We expect that this will help to generate a quick feedback loop. We plan to use these quick feedback loops to steadily upgrade the app, hopefully positioning our app as the main go-to choice in the Gnome-location app market in a few months.

## Features

- Filter Gnomes by name, in case the player already knows the name / family name of the Gnome
    - Players can search for a name or part of a name. Case insensitive search.
- Filter by professions, e.g. the player might want a sword upgrade, best achieved by helping a blacksmith, or may want additional health potions, in which case they might want to help a brewer.
    - By clicking / tapping on any profession, players can select / deselect it.
    - Selecting any number of professions will display any gnomes that have at least one of the selected professions
- Filter by age range: in case charitable players want to help the elderly or the children.
    - Gnome longevity is in all cases below 400 years, so age range is limited to 0 - 400
- Players can click on the "surprise me!" button, which by casting a powerful magic spell inside their device, will display a randomly ordered list of gnomes (no player mana required)
- Players can click on the '+' icon to find more details about one given gnome
- Players can always reset to the initial state by clicking on the 'reset filters' button

## App Component structure

App
- SearchArea
    - BasicSearch
    - AdvSearchToggler
        - AdvSearch
- SurpriseBtn
- List
    - ListItem
        - ReactModal
            - Detail
                - Profile
                    - FriendsList
                        - FriendItem