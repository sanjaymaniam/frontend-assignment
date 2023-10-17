# Frontend Assignment 🚀

Project: Mentions component
Time provided: 2 hours
Tech stack: React + Typescript
Link to design: [Design](https://www.figma.com/file/EEmRktq44VPR3u8Lx7otOJ/Frontend-Assignment---Dropdown?type=design&t=YyUdu9qHBb3sS66T-6)

Description
This is similar to the @-mentions in X/Twitter. The user can type any text in the input element but when user types `@` then a select box should appear from which they can select an option and it should be displayed in input element. For example `Hi @Luke Skywalker may the force be with you.`. An `onChange` handler should be triggered with the input and the options selected, in a format of your choice.
 
Instructions:

- Implement as much as possible in the given time.
- Push your code to Github/Gitlab/<any other> and send us the link.
- Please write us a note on what else you would do if you could spend more time.
 
What we look for:

- Thinking: Are you able to think through the flow and edge cases?
- Tests: How well is the code tested through unit/integration tests?
- Documentation: How can anyone new run this app locally and contribute to it?
- Code organisation: How are you organizing your components?
- Component Reusability: Ensure that mention component that you are creating is re-usable.
   - Ensure that consumer of mention component can pass `onChange` and `value` prop to make it controlled.

What we don’t look for:

 - Custom select box: You need not implement a custom select box. You're welcome to use the native select box or your favorite library.
 - Styling: It can look & feel very bare-bones, that's perfectly fine. 

From where you can get data for options while triggering mention actions
 - Use data present in data.json as raw data for mention component.

Happy coding! 💻
