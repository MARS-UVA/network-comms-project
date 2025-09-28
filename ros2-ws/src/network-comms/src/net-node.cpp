#include <chrono>
#include <functional>
#include <memory>
#include <string>
#include <thread>
#include "main.hpp"

#include "rclcpp/rclcpp.hpp"
#include "std_msgs/msg/string.hpp"

using namespace std::chrono_literals;

/* This example creates a subclass of Node and uses std::bind() to register a
* member function as a callback from the timer. */

ThreadInfo info;

class NetworkNode : public rclcpp::Node {
  public:
    NetworkNode()
    : Node("Network_Node") {
      publisher_ = this->create_publisher<std_msgs::msg::String>("topic", 10);
      timer_ = this->create_wall_timer(
      500ms, std::bind(&NetworkNode::timer_callback, this));
    }

  private:
    void timer_callback(){
        if (info.flag){
            auto message = std_msgs::msg::String();
            message.data = info.client_message;
             RCLCPP_INFO(this->get_logger(), "Publishing: '%s'", message.data.c_str());
            publisher_->publish(message);
            info.flag = false;
        }
      
    }
    rclcpp::TimerBase::SharedPtr timer_;
    rclcpp::Publisher<std_msgs::msg::String>::SharedPtr publisher_;
};


int main(int argc, char * argv[]){
  rclcpp::init(argc, argv);
  info.flag = false;
  memset (info.client_message, '\0', sizeof(info.client_message));
  std::thread socket(create_server, &info);
  rclcpp::spin(std::make_shared<NetworkNode>());
  socket.join();
  rclcpp::shutdown();

  return 0;
}