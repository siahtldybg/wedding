$(function () {
    const isDemo = $('body').data('demo') === true;
    const apiUrl = '';
    const weddingId = $('#weddingId').val();
    let currentPage = 0;
    const limit = 35;
    let allCommentsLoaded = false;
    let totalComments = 0;
    const commentList = $('#commentList');

    if (!weddingId) {
        return;
    }

    if (window.guestData && window.guestData.FullName) {
        $('#fullname').val(window.guestData.FullName);
    }

    if (!commentList) {
        return;
    }

    const isPrivateList = $(commentList).is('[private-list]');

    // Handle form submission
    $('#commentForm').on('submit', function (e) {
        e.preventDefault();
        if (isDemo) {
            $('#fullname').val('');
            $('#comment').val('');
            $('#relationship').val('');
            alert("Thiệp mẫu không thể bình luận");

            return;
        }
        const fullName = $('#fullname').val().trim();
        const comment = $('#comment').val().trim();
        const relationship = $('#relationship').val().trim();

        if (!fullName  || !comment ) {
            alert('Vui lòng nhập đầy đủ tên và lời chúc!');
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
										}),      headers: {
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
        
        const url = "https://docs.google.com/spreadsheets/d/1Q6IEtI8yUtwyRe4pqH-xo1fL20asVDHgb2RC-5YJkOk/gviz/tq?tqx=out:json";
            const res = await fetch(url);
            const text = await res.text();
            const json = JSON.parse(text.substring(47, text.length - 2));
            data = json.table.rows;
            displayComments(data);
    }
    function parseDateString(str) {
        const [y, m, d] = str.match(/\d+/g).map(Number);
        return `${String(d).padStart(2,'0')}/${String(m+1).padStart(2,'0')}/${y}`;
     }
    // Function to display comments
    function displayComments(comments) {
        //const commentList = $('#commentList');

        // Remove "no comments" message if it exists
        $('.no-comments').remove();
        
        // Clear existing comments if it's the first page
        if (currentPage === 0) {
            commentList.empty();
        }
        console.log('ad', comments)
        comments.forEach(comment => {
            const commentBox = `
                <div class="comment-box wow animate__animated animate__fadeInUp">
                    <div class="fullname">${comment.c[1].v.split("): ")[1].trim()}</div>
                    <div class="timestamp">${parseDateString(comment.c[0].v)}</div>
                    <div class="content">${comment.c[2].v}</div>
                </div>
            `;
            commentList.append(commentBox);
            });
        // Initialize animations for new elements
        if (typeof WOW !== 'undefined') {
            new WOW().init();
        }
    }

    // Helper function to add load more button
    function addLoadMoreButton() {
        if (!$('#loadMoreBtn').length) {
            const loadMoreBtn = `
                <div class="comment-box view-more wow animate__animated animate__fadeInUp">
                    <button id="loadMoreBtn" class="btn btn-link">Xem thêm lời chúc <i class="bi bi-arrow-right-short"></i></button>
                </div>
            `;

            commentList.append(loadMoreBtn);

            $('#loadMoreBtn').on('click', function () {
                loadComments();
            });
        }
    }

    // Helper function to remove load more button
    function removeLoadMoreButton() {
        $('#loadMoreBtn').remove();
    }

    // Helper function to escape HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Helper function to format date
    function formatDate(dateString) {
        if (!dateString) return '';

        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffMinutes = Math.floor(diffTime / (1000 * 60));

        if (diffMinutes < 1) return 'Vừa xong';
        if (diffMinutes < 60) return `${diffMinutes} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        if (diffDays < 7) return `${diffDays} ngày trước`;

        return date.toLocaleDateString('vi-VN');
    }

    if (isPrivateList) {
        commentList.html(`
        <div class="private-message">
            <i class="bi bi-chat-heart"></i> Gửi lời chúc riêng tư tới cô dâu chú rể
        </div>
        `);
        return;
    }

    // Load initial comments
    loadComments();
})