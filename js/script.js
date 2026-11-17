$(function () {
    const tourStorageKey = 'flyfun-tours-v1';
    const originalPackageValues = {
        'Tropical Beach Escape': 'beach',
        'Alpine Trail Hiking': 'alpine',
        'European Cultural Tour': 'europe',
        'Savannah Safari Explorer': 'safari'
    };
    function packageValue(name) {
        if (originalPackageValues[name]) return originalPackageValues[name];
        const slug = name.toLocaleLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        return `custom-${slug}`;
    }


    const $booking = $('#booking-form');
    if ($booking.length) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        
        try {
            const saved = localStorage.getItem(tourStorageKey);
            if (saved !== null) {
                const tours = JSON.parse(saved);
                const $select = $('#packageSelect');
                $select.find('option').not('[value=""]').remove();
                tours.forEach(tour => {
                    $('<option>').val(packageValue(tour.name)).text(tour.name).appendTo($select);
                });
            }
        } catch (_) {
            localStorage.removeItem(tourStorageKey);
        }
        const selectedPackage = new URLSearchParams(location.search).get('package');
        if ($('#packageSelect option').filter(function () { return this.value === selectedPackage; }).length) {
            $('#packageSelect').val(selectedPackage);
        }

        function validateBooking(showFeedback = true) {
            const email = $('#emailAddr').val().trim();
            const password = $('#password').val();
            const confirmation = $('#confirmPassword').val();
            const errors = [];
            if (!$('#fullName').val().trim()) errors.push('Enter your name.');
            if (!email) errors.push('Enter your email.');
            else if (!emailPattern.test(email)) errors.push('Enter a valid email.');
            if (!password || password.length < 8) errors.push('Password must have at least 8 characters.');
            if (password !== confirmation) errors.push('Passwords do not match.');
            if (!$('#packageSelect').val()) errors.push('Choose a tour package.');
            if (!$('#userMessage').val().trim()) errors.push('Enter a message.');

            if (showFeedback) {
                $('#booking-feedback')
                    .removeClass('alert-info alert-success alert-danger')
                    .addClass(errors.length ? 'alert-danger' : 'alert-success')
                    .text(errors.length ? errors.join(' ') : 'All fields look good.')
                    .prop('hidden', false);
            }
            return errors.length === 0;
        }

        $booking.on('input change', 'input, textarea, select', () => validateBooking());
        $('#password').on('input', function () {
            const value = this.value;
            const score = [value.length >= 8, /[A-Za-z]/.test(value), /\d/.test(value), /[^A-Za-z0-9]/.test(value)].filter(Boolean).length;
            const level = !value ? ['', '', 0] : score <= 1 ? ['Weak', 'bg-danger', 25] : score <= 2 ? ['Medium', 'bg-warning', 60] : ['Strong', 'bg-success', 100];
            $('#passwordStrength').text(value ? `${level[0]} password` : 'Use 8+ characters, including letters and numbers.');
            $('#passwordBar').removeClass('bg-danger bg-warning bg-success').addClass(level[1]).css('width', `${level[2]}%`);
        });
        $('#confirmPassword').on('input', function () {
            const matches = !this.value || this.value === $('#password').val();
            $('#passwordMatch').text(this.value ? (matches ? 'Passwords match.' : 'Passwords do not match.') : '')
                .toggleClass('text-success', matches).toggleClass('text-danger', !matches);
        });
        $booking.on('submit', function (event) {
            event.preventDefault();
            if (!validateBooking()) return;
            const data = new FormData(this);
            $('#booking-feedback').removeClass('alert-danger').addClass('alert-success')
                .text(`Preview for ${data.get('fullName')} — ${$('#packageSelect option:selected').text()}. Nothing was sent.`)
                .prop('hidden', false);
        });
    }

    const $rows = $('#tourRows');
    if ($rows.length) {
        const storageKey = tourStorageKey;
        const initialRows = $rows.children('tr').map(function () { return rowData($(this)); }).get();
        function rowData($row) {
            return { name: $row.find('th').first().text(), duration: $row.children('td').eq(0).text(), meals: $row.children('td').eq(1).text(), guide: $row.children('td').eq(2).text(), price: $row.children('td').eq(3).text().replace(/[^\d]/g, ''), category: $row.attr('data-category') || 'adventure' };
        }
        function renderRow(item) {
            const $row = $('<tr>').attr('data-category', item.category);
            $('<th scope="row">').text(item.name).appendTo($row);
            $('<td>').text(item.duration).appendTo($row);
            $('<td>').text(item.meals).appendTo($row);
            $('<td>').text(item.guide).appendTo($row);
            $('<td class="text-primary fw-bold">').text(`$${Number(item.price).toLocaleString('en-US')}`).appendTo($row);
            const $actions = $('<td>');
            $('<a class="btn btn-sm btn-outline-primary">')
                .attr('href', `contacts.html?package=${encodeURIComponent(packageValue(item.name))}#booking-form`)
                .text('Book').appendTo($actions);
            $('<button type="button" class="btn btn-sm btn-outline-secondary edit-tour">').text('Edit').appendTo($actions);
            $('<button type="button" class="btn btn-sm btn-outline-danger delete-tour ms-1">').text('Delete').appendTo($actions);
            $actions.appendTo($row);
            return $row;
        }
        function saveRows() {
            localStorage.setItem(storageKey, JSON.stringify($rows.children('tr').map(function () { return rowData($(this)); }).get()));
        }
        function applyFilters() {
            const query = $('#tourSearch').val().trim().toLocaleLowerCase();
            const category = $('#tourFilters .active').data('category') || 'all';
            let count = 0;
            $rows.children('tr').each(function () {
                const $row = $(this);
                const matches = (category === 'all' || $row.data('category') === category) && $row.text().toLocaleLowerCase().includes(query);
                $row.toggle(matches);
                if (matches) count++;
            });
            $('#tourCount').text(`${count} tours shown`);
        }
        try {
            const saved = localStorage.getItem(storageKey);
            const items = saved === null ? initialRows : JSON.parse(saved);
            $rows.empty();
            items.forEach(item => $rows.append(renderRow(item)));
        } catch (_) {
            localStorage.removeItem(storageKey);
            $rows.empty();
            initialRows.forEach(item => $rows.append(renderRow(item)));
        }

        $('#tourSearch').on('input', applyFilters);
        $('#tourFilters').on('click', 'button', function () {
            $('#tourFilters button').removeClass('active btn-primary').addClass('btn-outline-primary');
            $(this).addClass('active btn-primary').removeClass('btn-outline-primary');
            applyFilters();
        });
        $('#tourForm').on('submit', function (event) {
            event.preventDefault();
            const item = { name: $('#newTourName').val().trim(), duration: $('#newTourDuration').val().trim(), meals: $('#newTourMeals').val().trim(), guide: $('#newTourGuide').val().trim(), price: $('#newTourPrice').val(), category: $('#newTourCategory').val() };
            if (!item.name || !item.duration || !item.meals || !item.guide || Number(item.price) < 1) return;
            $rows.append(renderRow(item));
            saveRows();
            this.reset();
            applyFilters();
        });
        $rows.on('click', '.edit-tour', function () {
            const $row = $(this).closest('tr');
            const item = rowData($row);
            const fields = [
                ['Package name', 'name'], ['Duration', 'duration'],
                ['Meals included', 'meals'], ['Guide service', 'guide'],
                ['Price in USD', 'price']
            ];
            for (const [label, key] of fields) {
                const value = prompt(`${label}:`, item[key]);
                if (value === null || !value.trim()) return;
                item[key] = value.trim();
            }
            if (!/^\d+$/.test(item.price) || Number(item.price) < 1) {
                alert('Enter a valid positive price.');
                return;
            }
            const category = prompt('Category: beach, adventure, or culture', item.category);
            if (category === null || !['beach', 'adventure', 'culture'].includes(category.trim().toLowerCase())) {
                alert('Choose beach, adventure, or culture.');
                return;
            }
            item.category = category.trim().toLowerCase();
            $row.replaceWith(renderRow(item)); saveRows(); applyFilters();
        });
        $rows.on('click', '.delete-tour', function () {
            if (!confirm('Delete this tour package?')) return;
            $(this).closest('tr').remove(); saveRows(); applyFilters();
        });
        applyFilters();
    }


    const $images = $('.gallery-card img');
    const $box = $('#galleryLightbox');
    if ($images.length && $box.length) {
        let activeIndex = 0;
        function showImage(index) {
            activeIndex = (index + $images.length) % $images.length;
            const $image = $images.eq(activeIndex);
            $('#lightboxImage').stop(true, true).fadeOut(100, function () {
                $(this).attr('src', $image.attr('src')).attr('alt', $image.attr('alt'))
                    .css({ marginTop: '-12px', opacity: 0 }).show().animate({ marginTop: '0px', opacity: 1 }, 180);
            });
            $('#lightboxCaption').text($image.closest('.gallery-card').find('.gallery-caption').text());
        }
        function closeBox() {
            $box.fadeOut(180, function () { $(this).prop('hidden', true).attr('aria-hidden', 'true'); });
        }
        $images.css('cursor', 'zoom-in').on('click', function () {
            activeIndex = $images.index(this); showImage(activeIndex);
            $box.prop('hidden', false).attr('aria-hidden', 'false').hide().fadeIn(180);
        });
        $('.lightbox-prev').on('click', () => showImage(activeIndex - 1));
        $('.lightbox-next').on('click', () => showImage(activeIndex + 1));
        $('.lightbox-close').on('click', closeBox);
        $box.on('click', event => { if (event.target === $box[0]) closeBox(); });
        $(document).on('keydown', event => {
            if ($box.attr('aria-hidden') === 'true') return;
            if (event.key === 'Escape') closeBox();
            if (event.key === 'ArrowLeft') showImage(activeIndex - 1);
            if (event.key === 'ArrowRight') showImage(activeIndex + 1);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.setAttribute('data-bs-theme', 'dark');
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = ' <span class="theme-text">Light</span>';
            themeToggleBtn.classList.replace('btn-outline-primary', 'btn-outline-warning');
        }
    }

    
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-bs-theme');
            
            if (currentTheme === 'dark') {
                
                body.removeAttribute('data-bs-theme');
                localStorage.setItem('theme', 'light');
                themeToggleBtn.innerHTML = '<span class="theme-text">Dark</span>';
                themeToggleBtn.classList.replace('btn-outline-warning', 'btn-outline-primary');
            } else {
                
                body.setAttribute('data-bs-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeToggleBtn.innerHTML = ' <span class="theme-text">Light</span>';
                themeToggleBtn.classList.replace('btn-outline-primary', 'btn-outline-warning');
            }
        });
    }
});


$(document).ready(function() {
    $('.faq-question').on('click', function() {
        
        const $answer = $(this).next('.faq-answer');
        const $icon = $(this).find('.faq-icon');
        
        $answer.slideToggle(300);
            
        if ($icon.text() === '+') {
            $icon.text('−');
        } else {
            $icon.text('+');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('citySearch');
    const searchBtn = document.getElementById('searchWeatherBtn');
    const weatherContainer = document.getElementById('weatherContainer');

    
    async function getCoordinates(city) {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
        if (!response.ok) throw new Error('Geocoding failed');
        const data = await response.json();
        if (!data.results || data.results.length === 0) {
            throw new Error('City not found');
        }
        return data.results[0];
    }

 
    async function getWeather(lat, lon) {
        
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Weather fetch failed');
        return await response.json();
    }

    async function searchWeather() {
        const city = cityInput.value.trim();
        if (!city) return;

        
        while (weatherContainer.firstChild) {
            weatherContainer.removeChild(weatherContainer.firstChild);
        }
        
        
        const loadingP = document.createElement('p');
        loadingP.className = 'text-center text-secondary w-100';
        loadingP.textContent = 'Loading weather data...';
        weatherContainer.appendChild(loadingP);

        try {
            
            const location = await getCoordinates(city);
            
            
            const weatherData = await getWeather(location.latitude, location.longitude);
            const daily = weatherData.daily;

            
            while (weatherContainer.firstChild) {
                weatherContainer.removeChild(weatherContainer.firstChild);
            }

            
            const headerDiv = document.createElement('div');
            headerDiv.className = 'col-12 text-center mb-4';
            const h3 = document.createElement('h3');
            h3.className = 'fw-bold mb-1';
            h3.textContent = `${location.name}, ${location.country}`;
            const pSub = document.createElement('p');
            pSub.className = 'text-secondary mb-0';
            pSub.textContent = '7-Day Weather Forecast';
            headerDiv.appendChild(h3);
            headerDiv.appendChild(pSub);
            weatherContainer.appendChild(headerDiv);

            
            for (let i = 0; i < daily.time.length; i++) {
                const colDiv = document.createElement('div');
                colDiv.className = 'col-6 col-md-4 col-lg-3 mb-3';

                const cardDiv = document.createElement('div');
                cardDiv.className = 'card shadow-sm border-0 text-center p-3 h-100';

                const dateP = document.createElement('p');
                dateP.className = 'fw-bold mb-1';
                
                dateP.textContent = new Date(daily.time[i]).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

                const maxP = document.createElement('p');
                maxP.className = 'text-danger mb-0';
                maxP.textContent = `Max: ${daily.temperature_2m_max[i]}°C`;

                const minP = document.createElement('p');
                minP.className = 'text-primary mb-0';
                minP.textContent = `Min: ${daily.temperature_2m_min[i]}°C`;

                cardDiv.appendChild(dateP);
                cardDiv.appendChild(maxP);
                cardDiv.appendChild(minP);
                colDiv.appendChild(cardDiv);
                weatherContainer.appendChild(colDiv);
            }

        } catch (error) {
            console.error('Weather API Error:', error);
            
            
            while (weatherContainer.firstChild) {
                weatherContainer.removeChild(weatherContainer.firstChild);
            }

            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'col-12 col-md-8';
            
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-danger text-center';
            alertDiv.setAttribute('role', 'alert');
            
            if (error.message === 'City not found') {
                alertDiv.textContent = `Could not find city "${city}". Please check spelling.`;
            } else {
                alertDiv.textContent = 'The weather service is temporarily unavailable. Please try again later.';
            }
            
            errorDiv.appendChild(alertDiv);
            weatherContainer.appendChild(errorDiv);
        }
    }

   
    if (searchBtn) {
        searchBtn.addEventListener('click', searchWeather);
    }
    if (cityInput) {
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchWeather();
        });
    }
});



document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('authContainer');
    const loginForm = document.getElementById('loginForm');
    const loginModalElement = document.getElementById('loginModal');
    
    
    function checkAuthState() {
        const loggedInUser = localStorage.getItem('flyfun_user');
        
        
        while (authContainer.firstChild) {
            authContainer.removeChild(authContainer.firstChild);
        }
        
        if (loggedInUser) {
            const user = JSON.parse(loggedInUser);
            
            
            const wrapper = document.createElement('div');
            wrapper.className = 'd-flex align-items-center gap-2';
            
            const greeting = document.createElement('span');
            greeting.className = 'text-primary fw-bold d-none d-md-inline';
            greeting.textContent = `Hi, ${user.name}!`; 
            
            const logoutBtn = document.createElement('button');
            logoutBtn.id = 'logoutBtn';
            logoutBtn.className = 'btn btn-outline-danger btn-sm';
            logoutBtn.textContent = 'Sign Out';
            
            wrapper.appendChild(greeting);
            wrapper.appendChild(logoutBtn);
            authContainer.appendChild(wrapper);
            
            
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('flyfun_user');
                checkAuthState();
            });
            
        } else {
            
            const loginBtn = document.createElement('button');
            loginBtn.id = 'openLoginBtn';
            loginBtn.className = 'btn btn-primary btn-sm';
            loginBtn.type = 'button';
            loginBtn.setAttribute('data-bs-toggle', 'modal');
            loginBtn.setAttribute('data-bs-target', '#loginModal');
            loginBtn.textContent = 'Sign In';
            
            authContainer.appendChild(loginBtn);
        }
    }

    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const nameInput = document.getElementById('loginName');
            const emailInput = document.getElementById('loginEmail');

            nameInput.setCustomValidity('');

            if (!loginForm.checkValidity()) {
                loginForm.classList.add('was-validated');
                return;
            }

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();

            if (!name) {
                nameInput.setCustomValidity('Name cannot be empty or just spaces');
                loginForm.classList.add('was-validated');
                return;
            }

            const user = { name, email };
            localStorage.setItem('flyfun_user', JSON.stringify(user));

            const modal = bootstrap.Modal.getInstance(loginModalElement);
            if (modal) modal.hide();

            checkAuthState();

            loginForm.reset();
            loginForm.classList.remove('was-validated');
            nameInput.setCustomValidity('');
        });

        document.getElementById('loginName').addEventListener('input', function() {
            this.setCustomValidity('');
        });
    }

    if (authContainer) {
        checkAuthState();
    }
});