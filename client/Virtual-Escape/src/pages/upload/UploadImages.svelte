<h1>Upload Images</h1>

<form
    action="http://127.0.0.1:8080/api/images"
    method="POST"
    enctype="multipart/form-data"
>
    <input type="file" name="image-input" accept="image/*" />
    <input type="submit" />
</form>
