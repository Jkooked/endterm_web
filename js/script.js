/* FLY FUN endterm interactions */
$(function () {
    // Booking form validation and password feedback.
    const $booking = $('#booking-form');
    if ($booking.length) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
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
        const storageKey = 'flyfun-tours-v1';
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
            $('<a class="btn btn-sm btn-outline-primary" href="contacts.html#booking-form">').text('Book').appendTo($actions);
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
            if (saved !== null) {
                $rows.empty();
                JSON.parse(saved).forEach(item => $rows.append(renderRow(item)));
            }
        } catch (_) { localStorage.removeItem(storageKey); }

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
            const name = prompt('Package name:', item.name);
            if (name === null || !name.trim()) return;
            const price = prompt('Price in USD:', item.price);
            if (price === null || !/^\d+$/.test(price) || Number(price) < 1) return;
            item.name = name.trim(); item.price = price;
            $row.replaceWith(renderRow(item)); saveRows(); applyFilters();
        });
        $rows.on('click', '.delete-tour', function () {
            if (!confirm('Delete this tour package?')) return;
            $(this).closest('tr').remove(); saveRows(); applyFilters();
        });
        applyFilters();
    }
});
