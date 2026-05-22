import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStore } from "@/components/rpg/store";
import type { BuildMapping, BuildName } from "@/types/builds";

export interface FormProps {
  builds: BuildMapping;
  onSubmit: () => void;
}

const formSchema = z.object({
  name: z
    .string({ required_error: "Please enter a name" })
    .min(3, { message: "Name must be at least 3 characters" })
    .max(20, { message: "Name cannot be longer than 20 characters" }),
  build: z.union(
    [z.literal("thief"), z.literal("knight"), z.literal("mage"), z.literal("brigadier")],
    { required_error: "Please select a character build" },
  ),
});

type FormValues = z.infer<typeof formSchema>;

export function CharacterForm(props: FormProps) {
  const [disabled, setDisabled] = useState<boolean>(false);
    const [builds, setBuilds] = useState<Record<string, any>>({});
  const setName = useStore((state) => state.setName);
  const setBuild = useStore((state) => state.setBuild);
  const setStats = useStore((state) => state.setStats);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", build: "thief" },
  });

   // Fetch builds on component mount
  useEffect(() => {
    fetch("http://localhost:3000/api/builds")
      .then((res) => res.json())
      .then(setBuilds);
  }, []);

  function onSubmitHandler() {
    props.onSubmit();
    setDisabled(true);
  }

  return (
    <Card data-testid="character-form-card" className="w-full">
      <CardHeader>
        <CardTitle>Choose a name and build</CardTitle>
        <CardDescription>Be whatever you want to be, choose your path wisely</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="w-full lg:w-1/2 space-y-3" onSubmit={form.handleSubmit(onSubmitHandler)}>
            <fieldset disabled={disabled} className="space-y-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Character name</FormLabel>
                    <FormControl>
                      <Input
                        data-testid="character-name-input"
                        placeholder="Galactic space lord"
                        {...field}
                        onChange={(event) => {
                          field.onChange(event);
                          setName(event.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>Your display name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="build"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Build</FormLabel>
                    <Select
                      disabled={disabled}
                      onValueChange={(value) => {
                        const buildValue = value as BuildName;
                        field.onChange(buildValue);
                        setBuild(buildValue);
                        const { strength, agility, wisdom, magic } = props.builds[buildValue];
                        setStats(strength, agility, wisdom, magic);
                      }}
                      defaultValue="thief"
                    >
                      <FormControl>
                        <SelectTrigger data-testid="character-build-select">
                          <SelectValue placeholder="Select a build!" />
                        </SelectTrigger>
                      </FormControl>
                        <SelectContent>
                  {Object.keys(builds).map((key) => (
                    <SelectItem key={key} value={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
                      {/* <SelectContent>
                        <SelectItem value="thief">Thief</SelectItem>
                        <SelectItem value="knight">Knight</SelectItem>
                        <SelectItem value="mage">Mage</SelectItem>
                        <SelectItem value="brigadier">Brigadier</SelectItem>
                      </SelectContent> */}
                    </Select>
                    <FormDescription>Select your character&apos;s build</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
            <Button data-testid="character-start-button" disabled={disabled} className="justify-self-end">
              Start!
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
