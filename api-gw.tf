# #api gateway v2
# resource "aws_apigatewayv2_api" "createAuction-api-gw" {
#   name          = "v2-http-api-createAuction"
#   protocol_type = "HTTP"
# }

# resource "aws_apigatewayv2_api" "getAuctions-api-gw" {
#   name          = "v2-http-api-getAuctions"
#   protocol_type = "HTTP"
# }

# resource "aws_apigatewayv2_api" "getAuction-api-gw" {
#   name          = "v2-http-api-getAuction"
#   protocol_type = "HTTP"
# }

# resource "aws_apigatewayv2_api" "placeBid-api-gw" {
#   name          = "v2-http-api-placeBid"
#   protocol_type = "HTTP"
# }

# #api gw stage
# resource "aws_apigatewayv2_stage" "createAuction-gw-stage" {
#   api_id      = aws_apigatewayv2_api.createAuction-api-gw.id
#   name        = "$default"
#   auto_deploy = true
# }

# resource "aws_apigatewayv2_stage" "getAuctions-gw-stage" {
#   api_id      = aws_apigatewayv2_api.getAuctions-api-gw.id
#   name        = "$default"
#   auto_deploy = true
# }

# resource "aws_apigatewayv2_stage" "getAuction-gw-stage" {
#   api_id      = aws_apigatewayv2_api.getAuction-api-gw.id
#   name        = "$default"
#   auto_deploy = true
# }

# resource "aws_apigatewayv2_stage" "placeBid-gw-stage" {
#   api_id      = aws_apigatewayv2_api.placeBid-api-gw.id
#   name        = "$default"
#   auto_deploy = true
# }

# #api gw integration
# resource "aws_apigatewayv2_integration" "createAuction-gw-integration" {
#   api_id               = aws_apigatewayv2_api.createAuction-api-gw.id
#   integration_type     = "AWS_PROXY"
#   integration_method   = "POST"
#   integration_uri      = aws_lambda_function.createAuction-lambda.arn
#   passthrough_behavior = "WHEN_NO_MATCH"
# }
# resource "aws_apigatewayv2_integration" "getAuctions-gw-integration" {
#   api_id               = aws_apigatewayv2_api.getAuctions-api-gw.id
#   integration_type     = "AWS_PROXY"
#   integration_method   = "POST"
#   integration_uri      = aws_lambda_function.getAuctions-lambda.arn
#   passthrough_behavior = "WHEN_NO_MATCH"
# }

# resource "aws_apigatewayv2_integration" "getAuction-gw-integration" {
#   api_id               = aws_apigatewayv2_api.getAuction-api-gw.id
#   integration_type     = "AWS_PROXY"
#   integration_method   = "POST"
#   integration_uri      = aws_lambda_function.getAuction-lambda.arn
#   passthrough_behavior = "WHEN_NO_MATCH"
# }

# resource "aws_apigatewayv2_integration" "placeBid-gw-integration" {
#   api_id               = aws_apigatewayv2_api.placeBid-api-gw.id
#   integration_type     = "AWS_PROXY"
#   integration_method   = "POST"
#   integration_uri      = aws_lambda_function.placeBid-lambda.arn
#   passthrough_behavior = "WHEN_NO_MATCH"
# }

# #api gw route
# resource "aws_apigatewayv2_route" "createAuction-lambda-route" {
#   api_id = aws_apigatewayv2_api.createAuction-api-gw.id
#   //route_key     = "POST /{proxy+}"
#   route_key = "POST /auction/create"
#   target    = "integrations/${aws_apigatewayv2_integration.createAuction-gw-integration.id}"
# }

# resource "aws_apigatewayv2_route" "getAuctions-lambda-route" {
#   api_id = aws_apigatewayv2_api.getAuctions-api-gw.id
#   //route_key = "GET /{proxy+}"
#   route_key = "GET /auction/getauctions"
#   target    = "integrations/${aws_apigatewayv2_integration.getAuctions-gw-integration.id}"
# }

# resource "aws_apigatewayv2_route" "getAuction-lambda-route" {
#   api_id = aws_apigatewayv2_api.getAuction-api-gw.id
#   //route_key = "GET /{id}"
#   route_key = "GET /auction/getauction"
#   target    = "integrations/${aws_apigatewayv2_integration.getAuction-gw-integration.id}"
# }

# resource "aws_apigatewayv2_route" "placeBid-lambda-route" {
#   api_id = aws_apigatewayv2_api.placeBid-api-gw.id
#   //route_key = "PATCH /{id}/bid"
#   route_key = "PATCH /auction/{id}/bid"
#   target    = "integrations/${aws_apigatewayv2_integration.placeBid-gw-integration.id}"
# }
