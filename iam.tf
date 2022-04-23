#lambda role and policy
resource "aws_iam_role" "lambda-iam" {
  name = "lambda-iam"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy" "dynamodb-log-policy" {
  name = "lambda-dynamodb-log-policy"
  role = aws_iam_role.lambda-iam.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [{
      "Effect" : "Allow",
      "Action" : [
        "dynamodb:BatchGetItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan",
        "dynamodb:BatchWriteItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem"
      ],
      "Resource" : [
        "arn:aws:dynamodb:ap-south-1:821975360837:table/auctions-table",
        "arn:aws:dynamodb:ap-south-1:821975360837:table/auctions-table/index/statusAndEndingDate"


        //"${aws_dynamodb_table.auctions-table.arn}",
        //"${aws_dynamodb_table.auctions-table.arn}/index/statusAndEndingDate"
      ]
      }
    ]
  })
}

