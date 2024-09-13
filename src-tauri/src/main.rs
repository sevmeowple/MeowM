// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use futures_util::StreamExt;
use tauri::{Emitter, Manager};
use tokio;
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

#[tauri::command]
async fn keep_say_hello(window: tauri::WebviewWindow) {
    // 连接到 WebSocket 服务器
    let url = url::Url::parse("ws://localhost:3002").unwrap();
    let (ws_stream, _) = connect_async(url.as_str())
        .await
        .expect("Failed to connect");

    // println!("WebSocket connected!");

    let (_write, mut read) = ws_stream.split();

    // 监听接收到的消息
    tokio::spawn(async move {
        while let Some(message) = read.next().await {
            match message {
                Ok(msg) => match msg {
                    Message::Text(text) => {
                        window
                            .emit(
                                "hello",
                                Payload {
                                    message: text.to_string(),
                                },
                            )
                            .unwrap_or_else(|e| println!("Failed to emit message: {:?}", e));
                    }
                    Message::Binary(bin) => {
                        // println!("Received binary message: {:?}", bin);
                    }
                    _ => {}
                },
                Err(e) => {
                    break;
                }
            }
        }

        // println!("WebSocket connection closed.");
    });
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_websocket::init())
        .invoke_handler(tauri::generate_handler![keep_say_hello, set_window_on_top])
        .setup(|app| {
            let window = app.get_webview_window("main").unwrap();

            // 通过调用命令来触发事件
            tauri::async_runtime::spawn(keep_say_hello(window));

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
