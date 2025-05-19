class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

module.exports = ApiResponse;

// class ApiResponse {
//   constructor(res, statusCode, message, data = null) {
//     this.statusCode = statusCode;
//     this.message = message;
//     this.data = data;
//     this.send(res);
//   }

//   send(res) {
//     res.status(this.statusCode).json({
//       success: this.statusCode < 400,
//       message: this.message,
//       data: this.data,
//     });
//   }
// }
