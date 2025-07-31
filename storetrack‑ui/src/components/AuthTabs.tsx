import { Tab } from "@headlessui/react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

export function AuthTabs() {
  return (
    <Tab.Group>
      <Tab.List className="flex space-x-4 mb-6">
        <Tab as="button" className={({ selected }) =>
            selected
              ? "px-4 py-2 font-medium bg-indigo-500 text-white rounded"
              : "px-4 py-2 font-medium bg-gray-200 rounded"
          }>
          Sign In
        </Tab>
        <Tab as="button" className={({ selected }) =>
            selected
              ? "px-4 py-2 font-medium bg-indigo-500 text-white rounded"
              : "px-4 py-2 font-medium bg-gray-200 rounded"
          }>
          Sign Up
        </Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel><SignInForm /></Tab.Panel>
        <Tab.Panel><SignUpForm /></Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
}
