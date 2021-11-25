#zip files
data "archive_file" "createAuction-lambda-zip" {
  type        = "zip"
  source_dir  = "src/handlers/createAuction"
  output_path = "createAuction-lambda.zip"
}

data "archive_file" "getAuctions-lambda-zip" {
  type        = "zip"
  source_dir  = "src/handlers/getAuctions"
  output_path = "getAuctions-lambda.zip"
}

data "archive_file" "getAuction-lambda-zip" {
  type        = "zip"
  source_dir  = "src/handlers/getAuction"
  output_path = "getAuction-lambda.zip"
}

data "archive_file" "placeBid-lambda-zip" {
  type        = "zip"
  source_dir  = "src/handlers/placeBid"
  output_path = "placeBid-lambda.zip"
}

data "archive_file" "processAuctions-lambda-zip" {
  type        = "zip"
  source_dir  = "src/handlers/processAuctions"
  output_path = "processAuctions-lambda.zip"
}

data "archive_file" "uploadAuctionPicture-lambda-zip" {
  type        = "zip"
  source_dir  = "src/handlers/uploadAuctionPicture"
  output_path = "uploadAuctionPicture.zip"
}


#lambda functions
resource "aws_lambda_function" "createAuction-lambda" {
  filename         = "createAuction-lambda.zip"
  function_name    = "createAuction-lambda-function"
  role             = aws_iam_role.lambda-iam.arn
  handler          = "createAuction.handler"
  source_code_hash = data.archive_file.createAuction-lambda-zip.output_base64sha256
  runtime          = "nodejs12.x"
}

resource "aws_lambda_function" "getAuctions-lambda" {
  filename         = "getAuctions-lambda.zip"
  function_name    = "getAuctions-lambda-function"
  role             = aws_iam_role.lambda-iam.arn
  handler          = "getAuctions.handler"
  source_code_hash = data.archive_file.getAuctions-lambda-zip.output_base64sha256
  runtime          = "nodejs12.x"
}

resource "aws_lambda_function" "getAuction-lambda" {
  filename         = "getAuction-lambda.zip"
  function_name    = "getAuction-lambda-function"
  role             = aws_iam_role.lambda-iam.arn
  handler          = "getAuction.handler"
  source_code_hash = data.archive_file.getAuction-lambda-zip.output_base64sha256
  runtime          = "nodejs12.x"
}

resource "aws_lambda_function" "placeBid-lambda" {
  filename         = "placeBid-lambda.zip"
  function_name    = "placeBid-lambda-function"
  role             = aws_iam_role.lambda-iam.arn
  handler          = "placeBid.handler"
  source_code_hash = data.archive_file.placeBid-lambda-zip.output_base64sha256
  runtime          = "nodejs12.x"
}

resource "aws_lambda_function" "processAuctions-lambda" {
  filename         = "processAuctions-lambda.zip"
  function_name    = "processAuctions-lambda-function"
  role             = aws_iam_role.lambda-iam.arn
  handler          = "processAuctions.handler"
  source_code_hash = data.archive_file.processAuctions-lambda-zip.output_base64sha256
  runtime          = "nodejs12.x"
}

resource "aws_lambda_function" "uploadAuctionPicture-lambda" {
  filename         = "uploadAuctionPicture.zip"
  function_name    = "uploadAuctionPicture-lambda-function"
  role             = aws_iam_role.lambda-iam.arn
  handler          = "uploadAuctionPicture.handler"
  source_code_hash = data.archive_file.uploadAuctionPicture-lambda-zip.output_base64sha256
  runtime          = "nodejs12.x"
}

#lambda permissions
# resource "aws_lambda_permission" "createAuction-api-gw-permissions" {
#   statement_id  = "AllowExecutionFromAPIGateway"
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.createAuction-lambda.arn
#   principal     = "apigateway.amazonaws.com"
#   source_arn    = "${aws_apigatewayv2_api.createAuction-api-gw.execution_arn}/*/*/*"
# }

# resource "aws_lambda_permission" "getAuctions-api-gw-permissions" {
#   statement_id  = "AllowExecutionFromAPIGateway"
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.getAuctions-lambda.arn
#   principal     = "apigateway.amazonaws.com"
#   source_arn    = "${aws_apigatewayv2_api.getAuctions-api-gw.execution_arn}/*/*/*"
# }

# resource "aws_lambda_permission" "getAuction-api-gw-permissions" {
#   statement_id  = "AllowExecutionFromAPIGateway"
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.getAuction-lambda.arn
#   principal     = "apigateway.amazonaws.com"
#   source_arn    = "${aws_apigatewayv2_api.getAuction-api-gw.execution_arn}/*/*/*"
# }

# resource "aws_lambda_permission" "placeBid-api-gw-permissions" {
#   statement_id  = "AllowExecutionFromAPIGateway"
#   action        = "lambda:InvokeFunction"
#   function_name = aws_lambda_function.placeBid-lambda.arn
#   principal     = "apigateway.amazonaws.com"
#   source_arn    = "${aws_apigatewayv2_api.placeBid-api-gw.execution_arn}/*/*/*"
# }



#lambda, cloudwatch, eventbridge
resource "aws_cloudwatch_event_rule" "processAuctions-event-rule" {
  name                = "processAuctions-event-rule"
  schedule_expression = "rate(3 minutes)"
}

resource "aws_cloudwatch_event_target" "processAuctions-event-target" {
  rule      = aws_cloudwatch_event_rule.processAuctions-event-rule.name
  target_id = "processAuction-lambda-function"
  arn       = aws_lambda_function.processAuctions-lambda.arn
}

resource "aws_lambda_permission" "processAuctions-cloudwatch-permissions" {
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.processAuctions-lambda.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.processAuctions-event-rule.arn
}


