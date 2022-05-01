#zip files
data "archive_file" "createSale-lambda-zip" {
  type        = "zip"
  source_dir  = "src/handlers/createSale"
  output_path = "createSale-lambda.zip"
}

data "archive_file" "getSale-lambda-zip" {
  type        = "zip"
  source_dir  = "src/handlers/getSale"
  output_path = "getSale-lambda.zip"
}

data "archive_file" "getSales-lambda-zip" {
  type        = "zip"
  source_dir  = "src/handlers/getSales"
  output_path = "getSales-lambda.zip"
}

data "archive_file" "paymentGW-lambda-zip" {
  type        = "zip"
  source_dir  = "src/handlers/paymentGW"
  output_path = "paymentGW-lambda.zip"
}

data "archive_file" "placeOrder-lambda-zip" {
  type        = "zip"
  source_dir  = "src/handlers/placeOrder"
  output_path = "placeOrder-lambda.zip"
}

data "archive_file" "processSale-lambda-zip" {
  type        = "zip"
  source_dir  = "src/handlers/processSale"
  output_path = "processSale-lambda.zip"
}

data "archive_file" "uploadItemPicture-lambda-zip" {
  type        = "zip"
  source_dir  = "src/handlers/uploadItemPicture"
  output_path = "uploadItemPicture.zip"
}


#lambda functions
resource "aws_lambda_function" "createSale-lambda" {
  filename         = "createSale-lambda.zip"
  function_name    = "createSale-lambda-function"
  role             = aws_iam_role.buyersclub-lambda-iam.arn
  handler          = "createSale.handler"
  source_code_hash = data.archive_file.createSale-lambda-zip.output_base64sha256
  runtime          = "nodejs12.x"
  layers = ["arn:aws:lambda:ap-south-1:821975360837:layer:buyersclub-package-layer:1"]
}

resource "aws_lambda_function" "getSale-lambda" {
  filename         = "getSale-lambda.zip"
  function_name    = "getSale-lambda-function"
  role             = aws_iam_role.buyersclub-lambda-iam.arn
  handler          = "getSale.handler"
  source_code_hash = data.archive_file.getSale-lambda-zip.output_base64sha256
  runtime          = "nodejs12.x"
  layers = ["arn:aws:lambda:ap-south-1:821975360837:layer:buyersclub-package-layer:1"]
}

resource "aws_lambda_function" "getSales-lambda" {
  filename         = "getSales-lambda.zip"
  function_name    = "getSales-lambda-function"
  role             = aws_iam_role.buyersclub-lambda-iam.arn
  handler          = "getSales.handler"
  source_code_hash = data.archive_file.getSales-lambda-zip.output_base64sha256
  runtime          = "nodejs12.x"
  layers = ["arn:aws:lambda:ap-south-1:821975360837:layer:buyersclub-package-layer:1"]
}

resource "aws_lambda_function" "paymentGW-lambda" {
  filename         = "paymentGW-lambda.zip"
  function_name    = "paymentGW-lambda-function"
  role             = aws_iam_role.buyersclub-lambda-iam.arn
  handler          = "paymentGW.handler"
  source_code_hash = data.archive_file.paymentGW-lambda-zip.output_base64sha256
  runtime          = "nodejs12.x"
  layers = ["arn:aws:lambda:ap-south-1:821975360837:layer:buyersclub-package-layer:1"]
}

resource "aws_lambda_function" "placeOrder-lambda" {
  filename         = "placeOrder-lambda.zip"
  function_name    = "placeOrder-lambda-function"
  role             = aws_iam_role.buyersclub-lambda-iam.arn
  handler          = "placeOrder.handler"
  source_code_hash = data.archive_file.placeOrder-lambda-zip.output_base64sha256
  runtime          = "nodejs12.x"
  layers = ["arn:aws:lambda:ap-south-1:821975360837:layer:buyersclub-package-layer:1"]
}

resource "aws_lambda_function" "processSale-lambda" {
  filename         = "processSale-lambda.zip"
  function_name    = "processSale-lambda-function"
  role             = aws_iam_role.buyersclub-lambda-iam.arn
  handler          = "processSale.handler"
  source_code_hash = data.archive_file.processSale-lambda-zip.output_base64sha256
  runtime          = "nodejs12.x"
  layers = ["arn:aws:lambda:ap-south-1:821975360837:layer:buyersclub-package-layer:1"]
}

resource "aws_lambda_function" "uploadItemPicture-lambda" {
  filename         = "uploadItemPicture.zip"
  function_name    = "uploadItemPicture-lambda-function"
  role             = aws_iam_role.buyersclub-lambda-iam.arn
  handler          = "UploadItemPicture.handler"
  source_code_hash = data.archive_file.uploadItemPicture-lambda-zip.output_base64sha256
  runtime          = "nodejs12.x"
  layers = ["arn:aws:lambda:ap-south-1:821975360837:layer:buyersclub-package-layer:1"]
}

#lambda permissions
# resource "aws_lambda_permission" "createSale-api-gw-permissions" {
#   statement_id  = "AllowExecutionFromAPIGateway"
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.createSale-lambda.arn
#   principal     = "apigateway.amazonaws.com"
#   source_arn    = "${aws_apigatewayv2_api.createSale-api-gw.execution_arn}/*/*/*"
# }

# resource "aws_lambda_permission" "getSales-api-gw-permissions" {
#   statement_id  = "AllowExecutionFromAPIGateway"
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.getSales-lambda.arn
#   principal     = "apigateway.amazonaws.com"
#   source_arn    = "${aws_apigatewayv2_api.getSales-api-gw.execution_arn}/*/*/*"
# }

# resource "aws_lambda_permission" "getSale-api-gw-permissions" {
#   statement_id  = "AllowExecutionFromAPIGateway"
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.getSale-lambda.arn
#   principal     = "apigateway.amazonaws.com"
#   source_arn    = "${aws_apigatewayv2_api.getSale-api-gw.execution_arn}/*/*/*"
# }

# resource "aws_lambda_permission" "placeOrder-api-gw-permissions" {
#   statement_id  = "AllowExecutionFromAPIGateway"
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.placeOrder-lambda.arn
#   principal     = "apigateway.amazonaws.com"
#   source_arn    = "${aws_apigatewayv2_api.placeOrder-api-gw.execution_arn}/*/*/*"
# }



#lambda, cloudwatch, eventbridge
resource "aws_cloudwatch_event_rule" "processSale-event-rule" {
  name                = "processSale-event-rule"
  schedule_expression = "rate(3 minutes)"
}

resource "aws_cloudwatch_event_target" "processSale-event-target" {
  rule      = aws_cloudwatch_event_rule.processSale-event-rule.name
  target_id = "processSale-lambda-function"
  arn       = aws_lambda_function.processSale-lambda.arn
}

resource "aws_lambda_permission" "processSale-cloudwatch-permissions" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.processSale-lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.processSale-event-rule.arn
}


