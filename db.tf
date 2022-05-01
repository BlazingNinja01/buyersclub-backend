resource "aws_dynamodb_table" "buyersclub-table" {
  name         = "buyers-club-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "status"
    type = "S"
  }
  attribute {
    name = "endingAt"
    type = "S"
  }
  global_secondary_index {
    name            = "statusAndEndingDate"
    hash_key        = "status"
    range_key       = "endingAt"
    projection_type = "ALL"
  }
}
