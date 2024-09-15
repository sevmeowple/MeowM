// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Emitter, Manager};
use tokio_tungstenite::{connect_async, tungstenite::protocol::Message};

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

#[tauri::command]
fn set_window_on_top(app: tauri::AppHandle, always_on_top: bool) {
    let window = app.get_webview_window("main").unwrap();
    window.set_always_on_top(always_on_top).unwrap();
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_http::init())
        .invoke_handler(tauri::generate_handler![set_window_on_top])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
