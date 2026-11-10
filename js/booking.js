const form = document.querySelector('#booking-form');
const packageSelect = document.querySelector('#packageSelect');
const feedback = document.querySelector('#booking-feedback');
const selectedPackage = new URLSearchParams(window.location.search).get('package');

if (Array.from(packageSelect.options).some(option => option.value === selectedPackage)) {
    packageSelect.value = selectedPackage;
}

form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    feedback.textContent = [
        `Tour: ${packageSelect.selectedOptions[0].textContent}`,
        `Name: ${data.get('fullName')}`,
        `Email: ${data.get('email')}`,
        `Travel date: ${data.get('travelDate') || 'Not specified'}`,
        `Message: ${data.get('message') || 'Not specified'}`,
        'Demo preview only. No request has been sent and no booking is confirmed.'
    ].join('\n');
    feedback.hidden = false;
});

form.addEventListener('input', () => {
    feedback.hidden = true;
});

const $booking = $('#booking-form');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validateBooking() {
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

    $('#booking-feedback')
        .removeClass('alert-info alert-success')
        .addClass(errors.length ? 'alert-danger' : 'alert-success')
        .text(errors.length ? errors.join(' ') : 'All fields look good.')
        .prop('hidden', false);

    return errors.length === 0;
}

$booking.on('input change', 'input, textarea, select', validateBooking);

$booking.on('submit', function (event) {
    event.preventDefault();

    if (!validateBooking()) return;

    $('#booking-feedback')
        .removeClass('alert-danger')
        .addClass('alert-success')
        .text('Request preview ready. This demo does not send your information.')
        .prop('hidden', false);
});

$('#password').on('input', function () {
    const value = this.value;
    const score = [
        value.length >= 8,
        /[A-Za-z]/.test(value),
        /\d/.test(value),
        /[^A-Za-z0-9]/.test(value)
    ].filter(Boolean).length;

    const level = !value
        ? ['', '', 0]
        : score <= 1
            ? ['Weak', 'bg-danger', 25]
            : score <= 2
                ? ['Medium', 'bg-warning', 60]
                : ['Strong', 'bg-success', 100];

    $('#passwordStrength').text(value ? `${level[0]} password` : 'Use 8+ characters.');
    $('#passwordBar')
        .removeClass('bg-danger bg-warning bg-success')
        .addClass(level[1])
        .css('width', `${level[2]}%`);
});

$('#tourForm').on('submit', function (event) {
    event.preventDefault();

    const item = {
        name: $('#newTourName').val().trim(),
        duration: $('#newTourDuration').val().trim(),
        meals: $('#newTourMeals').val().trim(),
        guide: $('#newTourGuide').val().trim(),
        price: $('#newTourPrice').val(),
        category: $('#newTourCategory').val()
    };

    if (!item.name || !item.duration || !item.meals || !item.guide || Number(item.price) < 1) {
        return;
    }

    $rows.append(renderRow(item));
    saveCustomTours();
    this.reset();
    applyFilters();
});

function applyFilters() {
    const query = $('#tourSearch').val().trim().toLocaleLowerCase();
    const category = $('#tourFilters .active').data('category') || 'all';
    let count = 0;

    $rows.children('tr').each(function () {
        const $row = $(this);
        const matchesCategory =
            category === 'all' || $row.data('category') === category;
        const matchesSearch =
            $row.text().toLocaleLowerCase().includes(query);

        $row.toggle(matchesCategory && matchesSearch);
        if (matchesCategory && matchesSearch) count++;
    });

    $('#tourCount').text(`${count} tours shown`);
}

$('#tourSearch').on('input', applyFilters);

$('#tourFilters').on('click', 'button', function () {
    $('#tourFilters button')
        .removeClass('active btn-primary')
        .addClass('btn-outline-primary');

    $(this)
        .addClass('active btn-primary')
        .removeClass('btn-outline-primary');

    applyFilters();
});

$rows.on('click', '.edit-tour', function () {
    const $row = $(this).closest('tr');
    const item = rowData($row);

    const name = prompt('Package name:', item.name);
    if (name === null || !name.trim()) return;

    const price = prompt('Price in USD:', item.price);
    if (price === null || !/^\d+$/.test(price) || Number(price) < 1) return;

    item.name = name.trim();
    item.price = price;

    $row.replaceWith(renderRow(item));
    saveCustomTours();
    applyFilters();
});

$rows.on('click', '.delete-tour', function () {
    if (!confirm('Delete this tour package?')) return;

    $(this).closest('tr').remove();
    saveCustomTours();
    applyFilters();
});
