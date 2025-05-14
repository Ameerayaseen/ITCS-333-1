<?php
class CourseReviewController {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function listReviews() {
        header("Content-Type: application/json; charset=UTF-8");
        $stmt = $this->pdo->query("SELECT * FROM course_reviews ORDER BY id DESC");
        $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($reviews, JSON_UNESCAPED_UNICODE);
    }

    public function searchReviews($keyword) {
        header("Content-Type: application/json; charset=UTF-8");
        $stmt = $this->pdo->prepare("SELECT * FROM course_reviews WHERE title LIKE :kw OR review LIKE :kw ORDER BY id DESC");
        $stmt->execute(['kw' => "%$keyword%"]);
        $reviews = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($reviews, JSON_UNESCAPED_UNICODE);
    }

    public function createReview($data) {
        header("Content-Type: application/json; charset=UTF-8");

        if (empty($data['title']) || empty($data['review'])) {
            http_response_code(400);
            echo json_encode(["message" => "Title and review are required."]);
            return;
        }

        $stmt = $this->pdo->prepare("INSERT INTO course_reviews (title, review) VALUES (:title, :review)");
        $stmt->execute([
            'title' => $data['title'],
            'review' => $data['review']
        ]);

        http_response_code(201); // Created
        echo json_encode(["message" => "Review added successfully."]);
    }

    public function updateReview($id, $data) {
        header("Content-Type: application/json; charset=UTF-8");

        if (empty($data['title']) || empty($data['review'])) {
            http_response_code(400);
            echo json_encode(["message" => "Title and review are required."]);
            return;
        }

        $stmt = $this->pdo->prepare("UPDATE course_reviews SET title = :title, review = :review WHERE id = :id");
        $stmt->execute([
            'title' => $data['title'],
            'review' => $data['review'],
            'id' => $id
        ]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "Review updated successfully."]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Review not found or data unchanged."]);
        }
    }

    public function deleteReview($id) {
        header("Content-Type: application/json; charset=UTF-8");

        $stmt = $this->pdo->prepare("DELETE FROM course_reviews WHERE id = :id");
        $stmt->execute(['id' => $id]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "Review deleted successfully."]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Review not found."]);
        }
    }
}
?>