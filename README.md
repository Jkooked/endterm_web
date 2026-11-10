# FLY FUN — Travel Agency

## Group: IT-2502

## Members: Saida Kh., Karima M., Ainaz A.

FLY FUN is an educational travel agency website created for the Midterm Project. Visitors can learn about the agency, explore destinations, compare tour prices, and complete a demo booking form. The project focuses on travel and tourism, and the website interface is in English.

## Team Members and Individual Contributions

Our team has three members: **Karima, Saida, and Ainaz**. Responsibilities are assigned as follows:

| Team Member | Pages and Responsibilities |
| --- | --- |
| **Saida** | Home (`index.html`) and About (`about.html`): the hero section, destination cards, agency information, and guide profiles; the shared header and footer, Flexbox navigation, typography, and basic styling. |
| **Karima** | Tours (`tours.html`) and Contacts (`contacts.html`): the tour pricing table, booking form with labels and required fields, email validation, automatic tour selection, and a local booking request preview. |
| **Ainaz** | Gallery (`gallery.html`): the CSS Grid photo gallery and captions; tablet and mobile responsiveness, hover and focus effects, README documentation, and preparation for deployment. |

Each member should be able to explain the entire project, including the pages and code assigned to other members.

## Implemented Features

- Five pages with shared navigation and an active page indicator.
- Semantic HTML5 elements: `header`, `nav`, `main`, `section`, and `footer`.
- Destination cards using Bootstrap Grid and a separate photo gallery using CSS Grid.
- A comparison table for four tours, with horizontal scrolling on narrow screens and alternating rows using `:nth-child()`.
- A form with native HTML validation; each Book Now button automatically selects the corresponding tour.
- Responsive layouts with media queries at `767.98px` and `575.98px`, Flexbox, and CSS positioning.
- CSS variables, the Outfit font from Google Fonts, `:hover` effects, and visible keyboard focus.
- Lazy image loading with `loading="lazy"`.
- Contact details, a copyright notice, and external social platform links in the footer.

## Technologies Used

HTML5, CSS3, Bootstrap **5.3.3**, Google Fonts, and a small JavaScript file for the demo form. Bootstrap is included locally in `css/bootstrap.min.css`; all custom styles are in `css/style.css`. No build process or npm installation is required.

## Website Screenshots

These screenshots show the current project rendered locally in a browser.

### Home

The home page introduces FLY FUN and displays destination cards in a responsive Bootstrap layout.

![Home page with the hero section and destination cards](screenshots/site/home.jpg)

### About

The about page presents the agency, its mission, and guide profiles.

![About page with agency information and guide profiles](screenshots/site/about.jpg)

### Tours

The tours page compares four travel packages and links each Book Now button to the booking form.

![Tours page with the pricing comparison table](screenshots/site/tours.jpg)

### Gallery

The gallery displays travel photographs and captions in a CSS Grid layout.

![Gallery page with travel photographs and captions](screenshots/site/gallery.jpg)

### Contacts

The contacts page contains the demo booking form with labeled fields and native HTML validation.

![Contacts page with the demo booking form](screenshots/site/contacts.jpg)

## Code Examples

The following screenshots show excerpts from the project source and their visible results.

### 1. Bootstrap Grid

In `index.html`, `col-12 col-md-6 col-lg-4` gives each destination card the full row on small screens, half the row on medium screens, and one third of the row on large screens. See the destination cards in the [Home screenshot](#home).

![HTML source for the responsive Bootstrap destination cards](screenshots/code/bootstrap-grid.png)

### 2. CSS Grid

In `css/style.css`, `.custom-gallery-grid` uses `repeat(auto-fit, minmax(280px, 1fr))` to arrange photographs in columns that fit the available space. See the [Gallery screenshot](#gallery).

![CSS source for the photo gallery grid](screenshots/code/css-grid.png)

### 3. Flexbox Navigation

The header and `.nav-list` use Flexbox to align the logo and navigation links. The links can wrap when space is limited. See the header in the [Home screenshot](#home).

![CSS source for the shared Flexbox header and navigation](screenshots/code/flexbox-navigation.png)

### 4. Alternating Table Rows

The selector `.custom-table tbody tr:nth-child(even) > *` applies a different background to every second table row, making the tour comparison easier to read. See the table in the [Tours screenshot](#tours).

![CSS source for alternating tour table row colors](screenshots/code/alternating-table.png)

### 5. Visible Keyboard Focus

The `:focus-visible` rules add an outline to links and buttons during keyboard navigation.

![CSS source for visible keyboard focus outlines](screenshots/code/focus-visible.png)

The booking form button below has keyboard focus.

![Booking form button with a visible keyboard focus outline](screenshots/site/focus-button.jpg)

### 6. Responsive Layout

Media queries at `767.98px` and `575.98px` adjust the header, navigation, spacing, and gallery for smaller screens.

![CSS source for tablet and mobile layout adjustments](screenshots/code/responsive-layout.png)

At a viewport width of **390 pixels**, the gallery uses a single column and the logo sits above the navigation menu.

![Gallery page rendered at a 390-pixel mobile viewport](screenshots/site/mobile-gallery.jpg)

## How to Open

Open the live website: [FLY FUN](https://jkooked.github.io/midterm_web/).

Repository: [Jkooked/midterm_web](https://github.com/Jkooked/midterm_web).

## Demo Form

The booking form validates input and displays a local preview. It does not send requests, save submissions, or confirm bookings. Contact details are for demonstration purposes, and the social links lead to the platforms' homepages.

# Endterm Project Update

## Project Topic and Summary

FLY FUN remains a responsive travel agency website. This Endterm update adds client-side interactions to the existing Midterm pages: validated booking and registration fields, a searchable tour catalog with editable records, and an interactive destination gallery. The site gives visitors clearer feedback while they browse tours and prepare a demo booking request.

## Endterm Features and Benefits

- **Booking form validation:** required fields and email format are checked before the preview is shown. Password strength and confirmation feedback help visitors correct mistakes while typing.
- **Tour search and category filters:** visitors can find trips by destination, duration, or price and narrow the list by category without reloading the page.
- **Tour table CRUD:** visitors can add, read, update, and delete tour packages. Changes persist in that browser with `localStorage`.
- **Destination lightbox:** visitors can enlarge gallery images, move between them with navigation arrows, and close the viewer with Escape. Fade and motion effects make image changes clearer.
- **Responsive Bootstrap gallery:** Bootstrap cards and existing responsive styles keep the gallery usable on smaller screens.

## Technologies Used for the Endterm Update

HTML5, CSS3, Bootstrap 5.3.3, JavaScript, jQuery 3.7.1, and browser `localStorage`. The endterm JavaScript is in `js/script.js`; page styling remains in `css/style.css`.

## Endterm Team Member Contributions

| Team member | Endterm contribution | How it helps the site |
| --- | --- | --- |
| **Karima M.** | Booking form validation, email RegEx, password strength and confirmation feedback; adding and displaying tour records. | Helps visitors catch incomplete or invalid form entries and lets the team maintain the tour list. |
| **Saida Kh.** | Case-insensitive tour search, category filters, editing and deleting tours, and saving table changes locally. | Helps visitors find relevant trips quickly and keeps tour updates available after a page reload in the same browser. |
| **Ainaz A.** | Responsive Bootstrap gallery cards, lightbox, image navigation, keyboard controls, transitions, and this endterm documentation. | Lets visitors inspect destination photos at a larger size and navigate the gallery on desktop or mobile. |

## Endterm Code and Website Screenshots

The code screenshots below show the implementation sections for each member. The website images are the original page screenshots already included with the Midterm project; they show the page layouts, while the new interactive states are not visible in those older captures. New browser screenshots of the updated interactive states still need to be captured after opening the current site.

### Karima

Karima added form checks and password feedback, along with the tour creation and row-rendering pieces.

![Karima form validation code](screenshots/endterm/code/karima-validation.png)

![Karima password fields code](screenshots/endterm/code/karima-password-fields.png)

![Karima tour creation code](screenshots/endterm/code/karima-tour-create.png)

Original page screenshot: [Contacts and booking form](screenshots/site/contacts.jpg).

### Saida

Saida added live search and filters, plus tour editing and deletion with local persistence.

![Saida tour search and filters code](screenshots/endterm/code/saida-search-filter.png)

![Saida tour update and delete code](screenshots/endterm/code/saida-update-delete.png)

Original page screenshot: [Tour packages table](screenshots/site/tours.jpg).

### Ainaz

Ainaz added the responsive gallery, lightbox controls, and endterm documentation.

![Ainaz lightbox and navigation code](screenshots/endterm/code/ainaz-lightbox.png)

![Ainaz gallery markup and styles](screenshots/endterm/code/ainaz-gallery-html-css.png)

Original page screenshots: [Gallery page](screenshots/site/gallery.jpg) and [Mobile gallery page](screenshots/site/mobile-gallery.jpg).

## Endterm Submission Links

- Updated repository: [Jkooked/midterm_web](https://github.com/Jkooked/midterm_web)
- Published website: [FLY FUN on GitHub Pages](https://jkooked.github.io/midterm_web/)

Push the merged `main` branch to the existing repository so GitHub Pages can publish the latest changes.
