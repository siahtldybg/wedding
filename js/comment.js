$(function () {
    const isDemo = $('body').data('demo') === true;
    const weddingId = $('#weddingId').val();
    const commentList = $('#commentList');

    if (!weddingId || !commentList.length) {
        return;
    }

    if (window.guestData && window.guestData.FullName) {
        $('#fullname').val(window.guestData.FullName);
    }

    const isPrivateList = $(commentList).is('[private-list]');

    // Handle form submission
    $('#commentForm').on('submit', function (e) {
        e.preventDefault();
        if (isDemo) {
            $('#fullname').val('');
            $('#comment').val('');
            alert("Thiệp mẫu không thể bình luận");
            return;
        }
        const fullName = $('#fullname').val().trim();
        const comment = $('#comment').val().trim();
        const relationship = $('#relationship').val().trim();

        if (!fullName || !comment) {
            alert('Vui lòng nhập đầy đủ tên và lời chúc!');
            return;
        }

        if (fullName.length > 100) {
            alert('Tên quá dài (tối đa 100 ký tự)!');
            return;
        }
        if (comment.length > 500) {
            alert('Lời chúc quá dài (tối đa 500 ký tự)!');
            return;
        }

        submitComment(fullName, comment, relationship);
    });

    // Function to submit new comment
    function submitComment(fullName, comment, relationship) {
        fetch("https://script.google.com/macros/s/AKfycbzm8WdNg_Y5XBU88bES2m9HtSarZv7tEiTl3mMfvdmFtdXiUOATO2BDkq4Rajw9Gf-k/exec", {
            redirect: "follow",
            method: "POST",
            body: JSON.stringify({
                name: '(): ' + fullName,
                relationship: relationship,
                message: comment
            }), headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
        })
            .then(res => res.json())
            .then(data => {
                console.log("✅ Thành công:", data);
            })
            .catch(err => {
                console.error("❌ Lỗi gửi:", err);
            });

        setTimeout(() => {
            alert('Lời chúc của bạn đã được gửi thành công!');
            $('#fullname').val('');
            $('#comment').val('');
        }, 200);
    }

    // Function to load comments
    async function loadComments() {
        try {
            const url = "https://docs.google.com/spreadsheets/d/1Q6IEtI8yUtwyRe4pqH-xo1fL20asVDHgb2RC-5YJkOk/gviz/tq?tqx=out:json";
            const res = await fetch(url);
            const text = await res.text();
            const json = JSON.parse(text.substring(47, text.length - 2));
            const data = json.table.rows;
            displayComments(data);
        } catch (e) {
            console.error("Error loading comments:", e);
        }
    }

    function parseDateString(str) {
        if (!str) return '';
        const matches = str.match(/\d+/g);
        if (!matches) return str;
        const [y, m, d] = matches.map(Number);
        return `${String(d).padStart(2, '0')}/${String(m + 1).padStart(2, '0')}/${y}`;
    }

    // Function to display comments
    function displayComments(comments) {
        $('.no-comments').remove();
        commentList.empty();

        comments.forEach(comment => {
            const box = document.createElement('div');
            box.className = 'comment-box wow animate__animated animate__fadeInUp';

            const nameEl = document.createElement('div');
            nameEl.className = 'fullname';
            const rawName = comment.c[1]?.v || '';
            nameEl.textContent = rawName.includes('): ') ? rawName.split('): ')[1].trim() : rawName;

            const timeEl = document.createElement('div');
            timeEl.className = 'timestamp';
            timeEl.textContent = parseDateString(comment.c[0]?.v);

            const contentEl = document.createElement('div');
            contentEl.className = 'content';
            contentEl.textContent = comment.c[2]?.v || '';

            box.appendChild(nameEl);
            box.appendChild(timeEl);
            box.appendChild(contentEl);
            commentList.append(box);
        });

        if (typeof WOW !== 'undefined') {
            new WOW().init();
        }
    }

    if (isPrivateList) {
        commentList.html(`
        <div class="private-message">
            <i class="bi bi-chat-heart"></i> Gửi lời chúc riêng tư tới cô dâu chú rể
        </div>
        `);
        return;
    }

    loadComments();
});