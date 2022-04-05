const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Validate input.
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage '
        + 'tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  // Init book.
  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    finished,
    insertedAt,
    updatedAt,
  };

  // Add book.
  books.push(newBook);

  // Check if book was added.
  const isSuccess = books.filter((book) => book.id === id).length === 1;
  if (isSuccess) {
    return h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    }).code(201);
  }

  // If failed to add book.
  return h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  }).code(500);
};

const getBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;

  let filteredBooks = books;

  // Filter by name.
  if (name) {
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase()) !== false);
  }

  // Filter by reading.
  if (reading) {
    filteredBooks = filteredBooks.filter((book) =>
      Number(book.reading) === Number(reading));
  }

  // Filter by finished.
  if (finished) {
    filteredBooks = filteredBooks.filter((book) =>
      Number(book.finished) === Number(finished));
  }

  return h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
};

const getBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const book = books.find((book) => book.id === id);

  if (book) {
    return h.response({
      status: 'success',
      data: {book},
    });
  }

  return h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  }).code(404);
};

const editBookByIdHandler = (request, h) => {
  const {id} = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  // Validate input.
  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage '
        + 'tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  // Find book.
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    // Update book.
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt: new Date().toISOString(),
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
  }

  // If book not found.
  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const {id} = request.params;

  // Find book.
  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    // Delete book.
    books.splice(index, 1);

    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
  }

  // If book not found.
  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  addBookHandler,
  getBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
