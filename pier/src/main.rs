use std::error::Error;

use lambda_runtime::{error::HandlerError, lambda, Context};
use log::{self, error};
use serde_derive::{Deserialize, Serialize};
use simple_error::bail;

#[derive(Deserialize)]
struct CustomEvent {
  #[serde(rename = "firstName")]
  first_name: String,
}

#[derive(Serialize)]
struct CustomOutput {
  message: String,
}

fn main() -> Result<(), Box<dyn Error>> {
  lambda!(my_handler);
  Ok(())
}

fn my_handler(e: CustomEvent, c: Context) -> Result<CustomOutput, HandlerError> {
  println!("Handler running");

  if e.first_name == "" {
    error!("Empty first name in request {}", c.aws_request_id);
    bail!("Empty first name");
  }

  Ok(CustomOutput {
    message: format!("Hello, {}!", e.first_name),
  })
}
